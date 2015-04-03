/*
 * Flocking Playground
 *   Copyright 2014-2015, Colin Clark
 *
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */

/*global require*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    // TODO: Declarativize.
    flock.init();
    flock.debug.failHard = false;

    /**************
     * Playground *
     **************/

    fluid.defaults("flock.playground", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],

        model: {
            activeSynthSpec: {},
            isDeclarative: false
        },

        components: {
            enviro: "{environment}",

            demos: {
                type: "flock.playground.demos"
            },

            editor: {
                type: "flock.ui.codeMirror",
                container: "{that}.dom.editor",
                options: {
                    mode: "text/javascript"
                }
            },

            evaluator: {
                type: "flock.sourceEvaluator.code",
                options: {
                    events: {
                        onParseError: "{playground}.events.onError",
                        onEvaluationError: "{playground}.events.onError"
                    }
                }
            },

            demoSelector: {
                type: "flock.playground.demoSelector",
                container: "{that}.dom.demoSelector",
                options: {
                    listeners: {
                        afterDemoLoaded: "{editor}.setContent({arguments}.0)",

                        onSelect: [
                            "{playButton}.pause()"
                        ]
                    }
                }
            },

            playButton: {
                type: "flock.ui.enviroPlayButton",
                container: "{that}.dom.playButton",
                options: {
                    listeners: {
                        onPause: [
                            "{evaluator}.clearPlayable()",
                            "{enviro}.reset"
                        ]
                    }
                }
            }
        },

        invokers: {
            parse: "flock.playground.parseSource({editor}, {evaluator})"
        },

        events: {
            onSourceUpdated: null,
            onEvaluateDemo: "{playButton}.events.onPlay",
            onError: null
        },

        listeners: {
            onCreate: [
                "{demoSelector}.loadDemoFromURL()"
            ],

            onEvaluateDemo: [
                "{that}.parse()",
                "{evaluator}.evaluate()"
            ],

            onError: [
                "flock.fail({arguments}.0)"
            ]
        },

        selectors: {
            editor: "#source-view",
            playButton: "#playButton",
            demoSelector: "#demos"
        }
    });

    flock.playground.parseSource = function (editor, evaluator) {
        var source = editor.getSource();
        evaluator.parse(source);
    };
}());