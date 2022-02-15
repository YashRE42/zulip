"use strict";

const {strict: assert} = require("assert");

const {zrequire, with_overrides} = require("../zjsunit/namespace");
const {run_test} = require("../zjsunit/test");
const $ = require("../zjsunit/zjquery");
const {user_settings} = require("../zjsunit/zpage_params");

const emoji_ui = zrequire("emoji_ui");
const settings_config = zrequire("settings_config");

const initial_src_url = "initial_src/url";
const fake_still_url = "fake/still/url";
const escaped_fake_still_url = "fake\\/still\\/url";
const fake_animated_url = "fake/animated/url";
const escaped_fake_animated_url = "fake\\/animated\\/url";
const fake_emoji = $.create("fake emoji");
fake_emoji.length = 1;

function reset_fake_emoji() {
    fake_emoji.attr("src", initial_src_url);
    fake_emoji.attr("data-still-url", fake_still_url);
    fake_emoji.attr("data-animated-url", fake_animated_url);
}

run_test("animate_and_stop_animation", () => {
    reset_fake_emoji();
    emoji_ui.animate(fake_emoji);
    assert.equal(fake_emoji.attr("src"), escaped_fake_animated_url);
    emoji_ui.stop_animation(fake_emoji);
    assert.equal(fake_emoji.attr("src"), escaped_fake_still_url);
});

run_test("mouseenter/mouseleave handlers", () => {
    reset_fake_emoji();
    const emoji_container = $.create("emoji container");
    emoji_container.addEventListener = (type, handler) => emoji_container.on(type, handler);

    emoji_container.set_find_results("img.status_emoji[data-still-url]", fake_emoji);

    emoji_ui.bind_config_based_status_emoji_handlers($(emoji_container));
    const mouseenter_handler = emoji_container.get_on_handler("mouseenter");
    const mouseleave_handler = emoji_container.get_on_handler("mouseleave");

    function test_handlers_with_overrides({config_code, mouseenter_result, mouseleave_result}) {
        reset_fake_emoji();
        with_overrides(({override}) => {
            override(user_settings, "emoji_animation_config", config_code);
            mouseenter_handler({target: emoji_container});
            assert.equal(fake_emoji.attr("src"), mouseenter_result);
        });
        reset_fake_emoji();
        with_overrides(({override}) => {
            override(user_settings, "emoji_animation_config", config_code);
            mouseleave_handler({target: emoji_container});
            assert.equal(fake_emoji.attr("src"), mouseleave_result);
        });
    }
    test_handlers_with_overrides({
        config_code: settings_config.emoji_animation_config_values.always.code,
        mouseenter_result: initial_src_url,
        mouseleave_result: initial_src_url,
    });
    test_handlers_with_overrides({
        config_code: settings_config.emoji_animation_config_values.never.code,
        mouseenter_result: initial_src_url,
        mouseleave_result: initial_src_url,
    });
    test_handlers_with_overrides({
        config_code: settings_config.emoji_animation_config_values.on_hover.code,
        mouseenter_result: escaped_fake_animated_url,
        mouseleave_result: escaped_fake_still_url,
    });
});
