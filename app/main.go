package main

import(
	"flag"
	"fmt"

  "github.com/streamlio/ui/app/server"
)

var(
  argPort = flag.Int("port", 3031, "The port to listen to for incoming HTTP requests.")
	argApiServerAddress = flag.String("apiserver-address", "http://localhost:9000", "" +
		"The address of the Streamlio Apiserver " +
		"to connect to in the format of protocol://address:port, e.g., " +
		"http://localhost:9000.")
  argUIRootPath = flag.String("root-path", "./public", "" +
    "The file path to server the UI out of.")
  argDebug = flag.Bool("debug", false, "")
)


func main() {
	flag.Parse()

	config := server.Config{
	  Port: *argPort,
	  APIServerAddress: *argApiServerAddress,
	  UIRootPath: *argUIRootPath,
	  Debug: *argDebug,
  }

  fmt.Println("starting streamlio ui")
	fmt.Println("port:", config.Port)
	fmt.Println("root-path:", config.UIRootPath)
	fmt.Println("apiserver:", config.APIServerAddress)
	fmt.Println("debug:", config.Debug)

	server.Run(config)
}
