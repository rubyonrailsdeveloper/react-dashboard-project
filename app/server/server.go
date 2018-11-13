package server

import(
  "fmt"
  "net/http"
  "os"
  "path"
  "path/filepath"
  "strings"
  "time"
)

type Config struct {
  Port int
  APIServerAddress string
  UIRootPath string
  Debug bool
}

const(
  apiPrefix = "/api/v1"
)


func Run(config Config) {
  router := http.NewServeMux()

  handler, err := newUIHandler(config)
  if err != nil {
    fmt.Println("error starting ui server:", err)
  }

  if config.Debug {
    handler = profiler(handler)
  }

  router.Handle("/healthz", healthz())

  router.Handle("/", handler)

  address := fmt.Sprintf(":%d", config.Port)

  if err := http.ListenAndServe(address, router); err != nil {
    fmt.Println("error starting ui server:", err)
  }
}

func healthz() http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    //if atomic.LoadInt32(&healthy) == 1 {
    w.WriteHeader(http.StatusOK)
    fmt.Fprintf(w, "ok")
    return
    //}
    //w.WriteHeader(http.StatusServiceUnavailable)
  })
}


func newUIHandler(config Config) (http.Handler, error) {
  apiproxy, err := NewAPIServerProxy(config.APIServerAddress, config.Debug)
  if err != nil {
    return nil, err
  }

  fileserver := http.FileServer(http.Dir(config.UIRootPath))

  handler := uiHandler{
    api: apiproxy,
    fileserver: fileserver,
    root: config.UIRootPath,
    debug: config.Debug,
  }

  return http.HandlerFunc(handler.handle), nil
}

type uiHandler struct {
  root string
  api http.Handler
  fileserver http.Handler
  debug bool
}

func (h *uiHandler) handle(w http.ResponseWriter, req *http.Request) {
  if strings.HasPrefix(req.URL.Path, apiPrefix) {
    h.api.ServeHTTP(w, req)
    return
  }

  upath := req.URL.Path
  upath = path.Clean(upath)

  if h.debug {
    fmt.Println("path:", upath)
  }

  file := path.Join(h.root, filepath.FromSlash(upath))
  if h.debug {
    fmt.Println("file:", file)
  }

  _, err := os.Open(file)
  if err != nil && os.IsNotExist(err) {
    // fmt.Println("file open error:", err)
    // if the file does not exist
    // serve index.html from the file server
    req.URL.Path = ""
  }

  h.fileserver.ServeHTTP(w, req)
}

func profiler(handler http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    start := time.Now()

    lrw := newLoggingResponseWriter(w)

    handler.ServeHTTP(lrw, r)
    duration := time.Now().Sub(start)
    fullPath := fmt.Sprintf("%s/%s", r.URL.Path, r.URL.RawQuery)
    fmt.Printf("http path %s time %v status %d\n", fullPath, duration, lrw.statusCode)
  })
}

type loggingResponseWriter struct {
  http.ResponseWriter
  statusCode int
}

func newLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
  return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
  lrw.statusCode = code
  lrw.ResponseWriter.WriteHeader(code)
}
