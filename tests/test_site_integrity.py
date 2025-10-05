"""Basic integrity checks for the single-page portfolio."""
from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


class SiteIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.index_html = (ROOT / "index.html").read_text(encoding="utf-8")
        cls.script_js = (ROOT / "script.js").read_text(encoding="utf-8")
        cls.style_css = (ROOT / "style.css").read_text(encoding="utf-8")

    def test_main_sections_exist(self) -> None:
        """Ensure the primary navigation sections are present."""
        expected_sections = ["about", "skills", "projects", "contact"]
        for section_id in expected_sections:
            with self.subTest(section=section_id):
                pattern = rf"<section[^>]*id=\"{section_id}\""
                self.assertRegex(
                    self.index_html,
                    pattern,
                    msg=f"Missing <section> with id='{section_id}'.",
                )

    def test_nav_links_cover_all_sections(self) -> None:
        """Navigation menu should link to the visible page sections."""
        nav_block = re.search(
            r"<ul class=\"nav__menu\".*?</ul>", self.index_html, flags=re.S
        )
        self.assertIsNotNone(nav_block, "Navigation menu block not found in HTML.")
        nav_block_text = nav_block.group(0)
        linked_ids = re.findall(r"href=\"#([a-z]+)\"", nav_block_text)
        for section_id in ["about", "skills", "projects", "contact"]:
            with self.subTest(section=section_id):
                self.assertIn(
                    section_id,
                    linked_ids,
                    msg=f"Navigation menu missing link to #{section_id}.",
                )

    def test_theme_and_nav_scripts_exist(self) -> None:
        """Key interactive behaviours should be implemented in the script."""
        for snippet in ["themeToggle", "navToggle", "IntersectionObserver"]:
            with self.subTest(snippet=snippet):
                self.assertIn(
                    snippet,
                    self.script_js,
                    msg=f"Expected '{snippet}' in script.js for interactive behaviour.",
                )

    def test_css_defines_theme_tokens(self) -> None:
        """CSS should expose root-level variables for theming."""
        root_block = re.search(r":root\s*{[^}]+}", self.style_css)
        self.assertIsNotNone(root_block, ":root block for theme tokens not found.")
        for token in ["--bg", "--surface", "--text", "--accent"]:
            with self.subTest(token=token):
                self.assertIn(
                    token,
                    root_block.group(0),
                    msg=f"Expected {token} custom property in :root block.",
                )


if __name__ == "__main__":
    unittest.main()
