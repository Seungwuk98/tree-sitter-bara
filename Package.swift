// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterBara",
    products: [
        .library(name: "TreeSitterBara", targets: ["TreeSitterBara"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterBara",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterBaraTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterBara",
            ],
            path: "bindings/swift/TreeSitterBaraTests"
        )
    ],
    cLanguageStandard: .c11
)
