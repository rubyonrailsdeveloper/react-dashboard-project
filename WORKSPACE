BAZEL_DOCKER_RULES_VERSION = "0.4.0"
BAZEL_GO_RULES_VERSION = "0.10.1"

BAZEL_GO_RULES_PREFIX = "rules_go-%s" % (BAZEL_GO_RULES_VERSION)
BAZEL_GO_RULES_URL = "https://github.com/bazelbuild/rules_go/archive/%s.tar.gz" % (BAZEL_GO_RULES_VERSION)

BAZEL_DOCKER_RULES_PREFIX = "rules_docker-" + BAZEL_DOCKER_RULES_VERSION
BAZEL_DOCKER_RULES_URL = "https://github.com/bazelbuild/rules_docker/archive/v%s.tar.gz" % (BAZEL_DOCKER_RULES_VERSION)

STREAMLIO_BASE_IMAGE_VERSION = "0.0.3"

########### go compilation
http_archive(
  name = "io_bazel_rules_go",
  url = BAZEL_GO_RULES_URL,
  strip_prefix = BAZEL_GO_RULES_PREFIX,
)
load(
  "@io_bazel_rules_go//go:def.bzl",
  "go_rules_dependencies",
  "go_register_toolchains",
  "go_download_sdk",
  "go_repository",
)
go_rules_dependencies()
go_register_toolchains()


########## for docker images
http_archive(
  name = "io_bazel_rules_docker",
  url = BAZEL_DOCKER_RULES_URL,
  strip_prefix = BAZEL_DOCKER_RULES_PREFIX,
)

load(
  "@io_bazel_rules_docker//container:container.bzl",
  "container_pull",
  container_repositories = "repositories",
)

container_repositories()

container_pull(
  name = "streamlio_base",
  registry = "index.docker.io",
  repository = "streamlio/base",
  tag = STREAMLIO_BASE_IMAGE_VERSION,
)
