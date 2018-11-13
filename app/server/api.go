package server

import (
  "fmt"
  "net/http"
  "net/http/httputil"
  "net/url"
)

type proxy struct {
  url *url.URL
}


func NewAPIServerProxy(address string, debug bool) (http.Handler, error) {
  apiUrl, err := url.Parse(address)
  if err != nil {
    return nil, err
  }
  p := proxy{
    url: apiUrl,
  }

  return &httputil.ReverseProxy{
    Director: func(req *http.Request) {
      if debug {
        fmt.Println("incoming request:", req.URL)
      }

      req.URL.Scheme = p.url.Scheme
      req.URL.Host = p.url.Host
      req.URL.Path = req.URL.Path

      if debug {
        fmt.Println("outgoing request", req.URL)
      }
    },
  }, nil
}
