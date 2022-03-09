"use strict";

const {strict: assert} = require("assert");

const {zrequire} = require("../zjsunit/namespace");
const {run_test} = require("../zjsunit/test");
const $ = require("../zjsunit/zjquery");

const emoji_ui = zrequire("emoji_ui");

run_test("animate_and_stop_animation", () => {
    const fake_still_url = "fake/still/url";
    const escaped_fake_still_url = "fake\\/still\\/url";
    const fake_animated_url = "fake/animated/url";
    const escaped_fake_animated_url = "fake\\/animated\\/url";
    const test_emoji = $.create("test-emoji");
    test_emoji.length = 1;
    test_emoji.attr("src", "initial_src/url");
    test_emoji.attr("data-still-url", fake_still_url);
    test_emoji.attr("data-animated-url", fake_animated_url);
    const fake_container = $.create("fake container");
    fake_container.set_find_results("img.status_emoji[data-still-url]", test_emoji);
    const fake_target = $.create("fake target");
    fake_target.closest = () => fake_container;
    const fake_event = {target: fake_target};
    emoji_ui.handle_mouseenter_for_status_emoji(fake_event);
    assert.equal(test_emoji.attr("src"), escaped_fake_animated_url);
    emoji_ui.handle_mouseleave_for_status_emoji(fake_event);
    assert.equal(test_emoji.attr("src"), escaped_fake_still_url);
});
