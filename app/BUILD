package(default_visibility = ["//visibility:public"])

load(
  "@io_bazel_rules_go//go:def.bzl",
  "go_binary",
  "go_library",
)

go_binary(
  name = "streamlio-ui",
  embed = [":go_default_library"],
  pure = "on",
)

go_library(
  name = "go_default_library",
  srcs = [
    "main.go",
  ],
  importpath = "github.com/streamlio/ui/app",
  deps = [
    "//app/server:go_default_library",
  ],
)

filegroup(
  name = "package-srcs",
  srcs = glob(["**"]),
  tags = ["automanaged"],
  visibility = ["//visibility:private"],
)

filegroup(
  name = "all-srcs",
  srcs = [
    ":package-srcs",
  ],
  tags = ["automanaged"],
)
