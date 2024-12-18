import XCTest
import SwiftTreeSitter
import TreeSitterBara

final class TreeSitterBaraTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bara())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Bara grammar")
    }
}
