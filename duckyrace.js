var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
}
;
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {}
    ;
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
}
;
$jscomp.Symbol = function() {
    var a = 0;
    return function(b) {
        return $jscomp.SYMBOL_PREFIX + (b || "") + a++
    }
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
}
;
$jscomp.arrayIterator = function(a) {
    var b = 0;
    return $jscomp.iteratorPrototype(function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    })
}
;
$jscomp.iteratorPrototype = function(a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a
    };
    a[$jscomp.global.Symbol.iterator] = function() {
        return this
    }
    ;
    return a
}
;
$jscomp.makeIterator = function(a) {
    $jscomp.initSymbolIterator();
    $jscomp.initSymbol();
    $jscomp.initSymbolIterator();
    var b = a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
}
;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(a) {
    var b = function() {};
    b.prototype = a;
    return new b
}
;
$jscomp.underscoreProtoCanBeSet = function() {
    var a = {
        a: !0
    }
      , b = {};
    try {
        return b.__proto__ = a,
        b.a
    } catch (c) {}
    return !1
}
;
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b)
        throw new TypeError(a + " is not extensible");
    return a
}
: null;
$jscomp.inherits = function(a, b) {
    a.prototype = $jscomp.objectCreate(b.prototype);
    a.prototype.constructor = a;
    if ($jscomp.setPrototypeOf) {
        var c = $jscomp.setPrototypeOf;
        c(a, b)
    } else
        for (c in b)
            if ("prototype" != c)
                if (Object.defineProperties) {
                    var d = Object.getOwnPropertyDescriptor(b, c);
                    d && Object.defineProperty(a, c, d)
                } else
                    a[c] = b[c];
    a.superClass_ = b.prototype
}
;
$jscomp.iteratorFromArray = function(a, b) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var c = 0
      , d = {
        next: function() {
            if (c < a.length) {
                var e = c++;
                return {
                    value: b(e, a[e]),
                    done: !1
                }
            }
            d.next = function() {
                return {
                    done: !0,
                    value: void 0
                }
            }
            ;
            return d.next()
        }
    };
    d[Symbol.iterator] = function() {
        return d
    }
    ;
    return d
}
;
$jscomp.polyfill = function(a, b, c, d) {
    if (b) {
        c = $jscomp.global;
        a = a.split(".");
        for (d = 0; d < a.length - 1; d++) {
            var e = a[d];
            e in c || (c[e] = {});
            c = c[e]
        }
        a = a[a.length - 1];
        d = c[a];
        b = b(d);
        b != d && null != b && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
;
$jscomp.polyfill("Array.prototype.values", function(a) {
    return a ? a : function() {
        return $jscomp.iteratorFromArray(this, function(a, c) {
            return c
        })
    }
}, "es8", "es3");
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
    function b() {
        this.batch_ = null
    }
    function c(a) {
        return a instanceof e ? a : new e(function(b, c) {
            b(a)
        }
        )
    }
    if (a && !$jscomp.FORCE_POLYFILL_PROMISE)
        return a;
    b.prototype.asyncExecute = function(a) {
        null == this.batch_ && (this.batch_ = [],
        this.asyncExecuteBatch_());
        this.batch_.push(a);
        return this
    }
    ;
    b.prototype.asyncExecuteBatch_ = function() {
        var a = this;
        this.asyncExecuteFunction(function() {
            a.executeBatch_()
        })
    }
    ;
    var d = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function(a) {
        d(a, 0)
    }
    ;
    b.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length; ) {
            var a = this.batch_;
            this.batch_ = [];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                delete a[b];
                try {
                    c()
                } catch (l) {
                    this.asyncThrow_(l)
                }
            }
        }
        this.batch_ = null
    }
    ;
    b.prototype.asyncThrow_ = function(a) {
        this.asyncExecuteFunction(function() {
            throw a;
        })
    }
    ;
    var e = function(a) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var b = this.createResolveAndReject_();
        try {
            a(b.resolve, b.reject)
        } catch (k) {
            b.reject(k)
        }
    };
    e.prototype.createResolveAndReject_ = function() {
        function a(a) {
            return function(d) {
                c || (c = !0,
                a.call(b, d))
            }
        }
        var b = this
          , c = !1;
        return {
            resolve: a(this.resolveTo_),
            reject: a(this.reject_)
        }
    }
    ;
    e.prototype.resolveTo_ = function(a) {
        if (a === this)
            this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (a instanceof e)
            this.settleSameAsPromise_(a);
        else {
            a: switch (typeof a) {
            case "object":
                var b = null != a;
                break a;
            case "function":
                b = !0;
                break a;
            default:
                b = !1
            }
            b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
        }
    }
    ;
    e.prototype.resolveToNonPromiseObj_ = function(a) {
        var b = void 0;
        try {
            b = a.then
        } catch (k) {
            this.reject_(k);
            return
        }
        "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a)
    }
    ;
    e.prototype.reject_ = function(a) {
        this.settle_(2, a)
    }
    ;
    e.prototype.fulfill_ = function(a) {
        this.settle_(1, a)
    }
    ;
    e.prototype.settle_ = function(a, b) {
        if (0 != this.state_)
            throw Error("Cannot settle(" + a + ", " + b | "): Promise already settled in state" + this.state_);
        this.state_ = a;
        this.result_ = b;
        this.executeOnSettledCallbacks_()
    }
    ;
    e.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var a = this.onSettledCallbacks_, b = 0; b < a.length; ++b)
                a[b].call(),
                a[b] = null;
            this.onSettledCallbacks_ = null
        }
    }
    ;
    var f = new b;
    e.prototype.settleSameAsPromise_ = function(a) {
        var b = this.createResolveAndReject_();
        a.callWhenSettled_(b.resolve, b.reject)
    }
    ;
    e.prototype.settleSameAsThenable_ = function(a, b) {
        var c = this.createResolveAndReject_();
        try {
            a.call(b, c.resolve, c.reject)
        } catch (l) {
            c.reject(l)
        }
    }
    ;
    e.prototype.then = function(a, b) {
        function c(a, b) {
            return "function" == typeof a ? function(b) {
                try {
                    d(a(b))
                } catch (p) {
                    f(p)
                }
            }
            : b
        }
        var d, f, g = new e(function(a, b) {
            d = a;
            f = b
        }
        );
        this.callWhenSettled_(c(a, d), c(b, f));
        return g
    }
    ;
    e.prototype.catch = function(a) {
        return this.then(void 0, a)
    }
    ;
    e.prototype.callWhenSettled_ = function(a, b) {
        function c() {
            switch (d.state_) {
            case 1:
                a(d.result_);
                break;
            case 2:
                b(d.result_);
                break;
            default:
                throw Error("Unexpected state: " + d.state_);
            }
        }
        var d = this;
        null == this.onSettledCallbacks_ ? f.asyncExecute(c) : this.onSettledCallbacks_.push(function() {
            f.asyncExecute(c)
        })
    }
    ;
    e.resolve = c;
    e.reject = function(a) {
        return new e(function(b, c) {
            c(a)
        }
        )
    }
    ;
    e.race = function(a) {
        return new e(function(b, d) {
            for (var e = $jscomp.makeIterator(a), f = e.next(); !f.done; f = e.next())
                c(f.value).callWhenSettled_(b, d)
        }
        )
    }
    ;
    e.all = function(a) {
        var b = $jscomp.makeIterator(a)
          , d = b.next();
        return d.done ? c([]) : new e(function(a, e) {
            function f(b) {
                return function(c) {
                    g[b] = c;
                    h--;
                    0 == h && a(g)
                }
            }
            var g = []
              , h = 0;
            do
                g.push(void 0),
                h++,
                c(d.value).callWhenSettled_(f(g.length - 1), e),
                d = b.next();
            while (!d.done)
        }
        )
    }
    ;
    return e
}, "es6", "es3");
$jscomp.checkStringArgs = function(a, b, c) {
    if (null == a)
        throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
    if (b instanceof RegExp)
        throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
    return a + ""
}
;
$jscomp.polyfill("String.prototype.endsWith", function(a) {
    return a ? a : function(a, c) {
        var b = $jscomp.checkStringArgs(this, a, "endsWith");
        a += "";
        void 0 === c && (c = b.length);
        c = Math.max(0, Math.min(c | 0, b.length));
        for (var e = a.length; 0 < e && 0 < c; )
            if (b[--c] != a[--e])
                return !1;
        return 0 >= e
    }
}, "es6", "es3");
$jscomp.polyfill("String.prototype.startsWith", function(a) {
    return a ? a : function(a, c) {
        var b = $jscomp.checkStringArgs(this, a, "startsWith");
        a += "";
        var e = b.length
          , f = a.length;
        c = Math.max(0, Math.min(c | 0, b.length));
        for (var g = 0; g < f && c < e; )
            if (b[c++] != a[g++])
                return !1;
        return g >= f
    }
}, "es6", "es3");
$jscomp.owns = function(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b)
}
;
$jscomp.polyfill("Object.values", function(a) {
    return a ? a : function(a) {
        var b = [], d;
        for (d in a)
            $jscomp.owns(a, d) && b.push(a[d]);
        return b
    }
}, "es8", "es3");
var sources = "src/jk/globals.js src/jk/BlurFilter.js src/jk/ColorMatrixFilter.js src/jk/Ease.js src/jk/Event.js src/jk/EventDispatcher.js src/jk/GlowFilter.js src/jk/Gradient.js src/jk/KeyboardEvent.js src/jk/Keyboard.js src/jk/MouseEvent.js src/jk/Preloader.js src/jk/Sound.js src/jk/Ticker.js src/jk/Timer.js src/jk/Tween.js src/jk/DisplayObject.js src/jk/Container.js src/jk/ForeignObject.js src/jk/Image.js src/jk/PrintJob.js src/jk/Shape.js src/jk/Ellipse.js src/jk/Path.js src/jk/Rect.js src/jk/Stage.js src/jk/SVG.js src/jk/Text.js src/jk/TextInput.js src/arcademics/ContentType.js src/arcademics/GameLauncher.js src/arcademics/GameType.js src/arcademics/GenericEvent.js src/arcademics/QuestionType.js src/arcademics/QuickStart.js src/arcademics/ScoreType.js src/arcademics/Settings.js src/arcademics/api/GATracker.js src/arcademics/api/Service.js src/arcademics/content/AnswerButton.js src/arcademics/content/ContentItem.js src/arcademics/content/ContentManager.js src/arcademics/content/PlayerArea.js src/arcademics/content/PowerUpSprite.js src/arcademics/content/QuestionArea.js src/arcademics/content/QuestionBox.js src/arcademics/content/display/HTML.js src/arcademics/content/generators/SubtractionGenerator.js src/arcademics/controls/Button.js src/arcademics/controls/ColorPicker.js src/arcademics/controls/ColorSwatch.js src/arcademics/controls/GameList.js src/arcademics/controls/GameListItem.js src/arcademics/controls/GameListTab.js src/arcademics/controls/PlayButton.js src/arcademics/controls/PrimaryButton.js src/arcademics/controls/ScrollPane.js src/arcademics/controls/SecondaryButton.js src/arcademics/lang/AR.js src/arcademics/lang/EN.js src/arcademics/lang/ES.js src/arcademics/lang/FR.js src/arcademics/lang/HI.js src/arcademics/lang/NL.js src/arcademics/lang/PT.js src/arcademics/lang/RU.js src/arcademics/lang/VI.js src/arcademics/lang/Locale.js src/arcademics/games/CountdownClip.js src/arcademics/games/GameBase.js src/arcademics/games/GameInstance.js src/arcademics/games/Response.js src/arcademics/games/WinnerClip.js src/arcademics/games/ovalrace/OvalRaceCrowd.js src/arcademics/games/ovalrace/OvalRaceGame.js src/arcademics/games/ovalrace/OvalRaceMap.js src/arcademics/games/ovalrace/OvalRaceRacer.js src/arcademics/games/ovalrace/OvalRaceSpectator.js src/arcademics/games/ovalrace/OvalRaceSpreadEngine.js src/arcademics/games/ovalrace/OvalRaceTrack.js src/arcademics/games/ovalrace/duckyrace/DuckyRaceGame.js src/arcademics/games/ovalrace/duckyrace/DuckyRaceRacer.js src/arcademics/multiclient/MultiClient.js src/arcademics/multiclient/MultiClientEvent.js src/arcademics/multiclient/Room.js src/arcademics/multiclient/User.js src/arcademics/multiclient/Zone.js src/arcademics/powerups/Booster.js src/arcademics/powerups/Lightning.js src/arcademics/powerups/LightningAngled.js src/arcademics/powerups/LightningStrike.js src/arcademics/powerups/LightningStun.js src/arcademics/powerups/PowerUpReady.js src/arcademics/screens/IntroScreen.js src/arcademics/screens/GameScreen.js src/arcademics/screens/GameplayScreen.js src/arcademics/screens/LobbyScreen.js src/arcademics/screens/LobbyScreen12.js src/arcademics/screens/PlayerScreen.js src/arcademics/screens/ResultsScreen.js src/arcademics/screens/ScreenManager.js src/arcademics/screens/TitleScreen.js src/arcademics/screens/certificates/Certificate.js src/arcademics/screens/dialogs/CreateGameDialog.js src/arcademics/screens/dialogs/ErrorDialog.js src/arcademics/screens/dialogs/GameDialog.js src/arcademics/screens/dialogs/JoinGameDialog.js src/arcademics/screens/dialogs/PlayerDialog.js src/arcademics/screens/lobby/LobbySprite4.js src/arcademics/screens/lobby/LobbySprite12.js src/arcademics/screens/results/ResultsSprite4.js src/arcademics/utils/ColorUtility.js src/arcademics/utils/DisplayUtility.js src/arcademics/utils/RandomUtility.js src/arcademics/utils/StringUtility.js src/arcademics/utils/Utility.js".split(" ")
  , arcademics = {}
  , jk = {};
arcademics.DuckyRace = function(a) {
    arcademics.Settings.gameId = 4177055;
    arcademics.Settings.gameTitle = "Ducky Race";
    arcademics.Settings.gamePrefix = "ArcademicsCup";
    arcademics.Settings.copyrightTextColor = "#333333";
    arcademics.Settings.backgroundTextColor = "#FFFFFF";
    arcademics.Settings.numOfPlayers = 12;
    arcademics.Settings.gameType = arcademics.GameType.FFA;
    arcademics.Settings.scoreType = arcademics.ScoreType.TIME;
    arcademics.Settings.questionType = arcademics.QuestionType.ARITHMETIC;
    arcademics.Settings.reset();
    arcademics.Settings.track = "DuckyRaceTrack";
    arcademics.Settings.finishLine = "DuckyRaceFinishLine";
    arcademics.Settings.racerClass = arcademics.DuckyRaceRacer;
    arcademics.Settings.tracksDuration = 2E3;
    arcademics.Settings.tracksTo = {
        alpha: 0,
        scaleX: 0,
        scaleY: 0
    };
    arcademics.Settings.racerScale = .6;
    arcademics.Settings.racerWidth = 25;
    arcademics.Settings.racerLength = 70;
    arcademics.Settings.backgroundColor = "#47D3C2";
    arcademics.Settings.computerAnswerProbability = .01;
    arcademics.Settings.computerAccuracy = .85;
    arcademics.Settings.computerAccuracy = .85;
    arcademics.Settings.boosterProps = [-42, -5, 1, 1, 0, -42, 5, 1, -1, 0];
    arcademics.Settings.boosterDuration = 2E3;
    arcademics.Settings.boosterSound = "power_up1";
    arcademics.Settings.lightningProps = [-34, 0, 1, 1, 0];
    arcademics.Settings.lightningStrikeProps = [-26, 0, 1, 1, 0];
    arcademics.Settings.lightningStunProps = [-30, 0, .7, .6, 0];
    arcademics.Settings.lightningDuration = 2E3;
    arcademics.Settings.lightningSound = "power_up1";
    arcademics.Settings.preloaderManifest = "/graphics/_shared.svg /graphics/ducky-race.svg /sounds/bell.mp3 /sounds/buzz.mp3 /sounds/cheer.mp3 /sounds/chime.mp3 /sounds/click.mp3 /sounds/duck_right1.mp3 /sounds/duck_right2.mp3 /sounds/duck_wrong.mp3 /sounds/fanfare.mp3 /sounds/intro.mp3 /sounds/power_up_ready.mp3 /sounds/power_up1.mp3 /sounds/waves2.mp3".split(" ");
    arcademics.GameLauncher.launch(a)
}
;
var svgns = "http://www.w3.org/2000/svg"
  , xlinkns = "http://www.w3.org/1999/xlink";
(function() {
    function a(a) {
        a && !a.setTargetAtTime && (a.setTargetAtTime = a.setTargetValueAtTime)
    }
    var b = document.createElement("style");
    b.appendChild(document.createTextNode("svg {-webkit-tap-highlight-color: transparent;}"));
    b.appendChild(document.createTextNode("g:focus {outline: none;}"));
    b.appendChild(document.createTextNode("text {-moz-user-select: none; -ms-user-select: none; -webkit-user-select: none; user-select: none; }"));
    b.appendChild(document.createTextNode("input[type='number'] {-moz-appearance: textfield;}"));
    b.appendChild(document.createTextNode("input[type='number']::-webkit-outer-spin-button, input[type='number']::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0;}"));
    b.appendChild(document.createTextNode("#print {display:none;}"));
    b.appendChild(document.createTextNode("@media print {body {height:98%;} #main {display:none;} #print {display:inline;}}"));
    document.head.appendChild(b);
    document.addEventListener("mousedown", function(a) {
        document.styleSheets[0].cssRules[1].style.outline = "none"
    });
    var c = (new Date).getTime();
    window.getTimer = function() {
        return (new Date).getTime() - c
    }
    ;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    window.isIE = function() {
        var a = navigator.userAgent;
        return -1 < (-1 < a.indexOf("MSIE ") || a.indexOf("Trident/"))
    }
    ;
    window.hasOwnProperty("webkitAudioContext") && !window.hasOwnProperty("AudioContext") && (window.AudioContext = webkitAudioContext,
    AudioContext.prototype.hasOwnProperty("createGain") || (AudioContext.prototype.createGain = AudioContext.prototype.createGainNode),
    AudioContext.prototype.hasOwnProperty("createDelay") || (AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode),
    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain,
    AudioContext.prototype.createGain = function() {
        var b = this.internal_createGain();
        a(b.gain);
        return b
    }
    ,
    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay,
    AudioContext.prototype.createDelay = function(b) {
        b = b ? this.internal_createDelay(b) : this.internal_createDelay();
        a(b.delayTime);
        return b
    }
    ,
    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource,
    AudioContext.prototype.createBufferSource = function() {
        var b = this.internal_createBufferSource();
        b.start ? (b.internal_start = b.start,
        b.start = function(a, c, d) {
            "undefined" !== typeof d ? b.internal_start(a || 0, c, d) : b.internal_start(a || 0, c || 0)
        }
        ) : b.start = function(a, b, c) {
            b || c ? this.noteGrainOn(a || 0, b, c) : this.noteOn(a || 0)
        }
        ;
        b.stop ? (b.internal_stop = b.stop,
        b.stop = function(a) {
            b.internal_stop(a || 0)
        }
        ) : b.stop = function(a) {
            this.noteOff(a || 0)
        }
        ;
        a(b.playbackRate);
        return b
    }
    );
    window.hasOwnProperty("AudioContext") || (window.AudioContext = function() {
        this.createBufferSource = function() {
            return {
                buffer: null,
                connect: function() {},
                loop: !1,
                start: function() {},
                stop: function() {}
            }
        }
        ;
        this.createGain = function() {
            return {
                connect: function() {},
                gain: {
                    value: 1
                }
            }
        }
        ;
        this.decodeAudioData = function(a, b, c) {
            c()
        }
    }
    )
}
)();
this.jk = this.jk || {};
jk.BlurFilter = function(a, b, c) {
    this.blurX = a;
    this.blurY = b;
    this.strength = c
}
;
$jscomp.global.Object.defineProperties(jk.BlurFilter.prototype, {
    stdDeviation: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.blurX / 2 + "," + this.blurY / 2
        }
    }
});
this.jk = this.jk || {};
jk.ColorMatrixFilter = function(a, b, c, d, e, f, g, h) {
    this.redMultiplier = void 0 != a ? a : 1;
    this.greenMultiplier = void 0 != b ? b : 1;
    this.blueMultiplier = void 0 != c ? c : 1;
    this.alphaMultiplier = void 0 != d ? d : 1;
    this.redOffset = e || 0;
    this.greenOffset = f || 0;
    this.blueOffset = g || 0;
    this.alphaOffset = h || 0
}
;
jk.ColorMatrixFilter.prototype.adjustBrightness = function(a) {
    this.blueOffset = this.greenOffset = this.redOffset = a;
    return this
}
;
jk.ColorMatrixFilter.prototype.adjustContrast = function(a) {
    a = a / 100 + 1;
    var b = 128 * (1 - a);
    this.redMultiplier *= a;
    this.greenMultiplier *= a;
    this.blueMultiplier *= a;
    this.alphaMultiplier = 1;
    this.redOffset = this.redMultiplier * b;
    this.greenOffset = this.greenMultiplier * b;
    this.blueOffset = this.blueMultiplier * b;
    this.alphaOffset = 0;
    return this
}
;
jk.ColorMatrixFilter.prototype.setColorOffset = function(a, b) {
    b = void 0 === b ? .5 : b;
    this.redMultiplier = 1 - b;
    this.greenMultiplier = 1 - b;
    this.blueMultiplier = 1 - b;
    this.redOffset = Math.floor((a & 16711680) * b / 65536);
    this.greenOffset = Math.floor((a & 65280) * b / 256);
    this.blueOffset = Math.floor((a & 255) * b);
    return this
}
;
$jscomp.global.Object.defineProperties(jk.ColorMatrixFilter.prototype, {
    values: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.redMultiplier + " 0 0 0 " + this.redOffset / 255 + " 0 " + this.greenMultiplier + " 0 0 " + this.greenOffset / 255 + " 0 0 " + this.blueMultiplier + " 0 " + this.blueOffset / 255 + " 0 0 0 " + this.alphaMultiplier + " " + this.alphaOffset / 255
        }
    }
});
this.jk = this.jk || {};
jk.Ease = function() {
    throw "Ease cannot be instantiated.";
}
;
jk.Ease.linear = function(a) {
    return a
}
;
jk.Ease.quadIn = function(a) {
    return a * a
}
;
jk.Ease.quadInOut = function(a) {
    return .5 > a ? 2 * a * a : -1 + (4 - 2 * a) * a
}
;
jk.Ease.quadOut = function(a) {
    return a * (2 - a)
}
;
this.jk = this.jk || {};
jk.Event = function(a, b) {
    this.type = a;
    this.currentTarget = b
}
;
jk.Event.ADDED_TO_STAGE = "addedToStage";
jk.Event.BLUR = "blur";
jk.Event.CHANGE = "change";
jk.Event.COMPLETE = "complete";
jk.Event.ENTER_FRAME = "enterFrame";
jk.Event.FOCUS = "focus";
jk.Event.FILE_LOAD = "fileLoad";
jk.Event.INPUT = "input";
jk.Event.MOTION_CHANGE = "motionChange";
jk.Event.REMOVED_FROM_STAGE = "removedFromStage";
jk.Event.TICK = "tick";
jk.Event.TIMER = "timer";
jk.Event.TIMER_COMPLETE = "timerComplete";
this.jk = this.jk || {};
jk.EventDispatcher = function() {
    this._eventListeners = {}
}
;
jk.EventDispatcher.prototype.addEventListener = function(a, b) {
    void 0 == this._eventListeners[a] && (this._eventListeners[a] = []);
    this._eventListeners[a].push(b)
}
;
jk.EventDispatcher.prototype.dispatchEvent = function(a) {
    var b = this._eventListeners[a.type];
    if (b)
        for (var c = 0; c < b.length; c++)
            b[c](a)
}
;
jk.EventDispatcher.prototype.removeAllEventListeners = function() {
    this._eventListeners = {}
}
;
jk.EventDispatcher.prototype.removeEventListener = function(a, b) {
    if (a = this._eventListeners[a])
        for (var c = 0; c < a.length; c++)
            a[c] == b && (a.splice(c, 1),
            c--)
}
;
this.jk = this.jk || {};
jk.GlowFilter = function(a, b, c, d, e) {
    this.color = a;
    this.alpha = b;
    this.blurX = c;
    this.blurY = d;
    this.strength = e
}
;
$jscomp.global.Object.defineProperties(jk.GlowFilter.prototype, {
    stdDeviation: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.blurX / 2 + "," + this.blurY / 2
        }
    },
    values: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            var a = parseInt(this.color.substring(1), 16);
            return "0 0 0 0 " + ((a & 16711680) >> 16) / 255 + " 0 0 0 0 " + ((a & 65280) >> 8) / 255 + " 0 0 0 0 " + (a & 255) / 255 + " 0 0 0 " + this.alpha + " 0"
        }
    }
});
this.jk = this.jk || {};
jk.Gradient = function(a, b, c, d, e) {
    this.type = a;
    this.colors = b;
    this.alphas = c;
    this.ratios = d;
    this.rotation = e
}
;
jk.Gradient.LINEAR = "linearGradient";
jk.Gradient.RADIAL = "radialGradient";
this.jk = this.jk || {};
jk.KeyboardEvent = function(a, b, c) {
    jk.Event.call(this, a, b);
    this.key = c
}
;
$jscomp.inherits(jk.KeyboardEvent, jk.Event);
jk.KeyboardEvent.TIMER_COMPLETE = jk.Event.TIMER_COMPLETE;
jk.KeyboardEvent.TIMER = jk.Event.TIMER;
jk.KeyboardEvent.TICK = jk.Event.TICK;
jk.KeyboardEvent.REMOVED_FROM_STAGE = jk.Event.REMOVED_FROM_STAGE;
jk.KeyboardEvent.MOTION_CHANGE = jk.Event.MOTION_CHANGE;
jk.KeyboardEvent.INPUT = jk.Event.INPUT;
jk.KeyboardEvent.FILE_LOAD = jk.Event.FILE_LOAD;
jk.KeyboardEvent.FOCUS = jk.Event.FOCUS;
jk.KeyboardEvent.ENTER_FRAME = jk.Event.ENTER_FRAME;
jk.KeyboardEvent.COMPLETE = jk.Event.COMPLETE;
jk.KeyboardEvent.CHANGE = jk.Event.CHANGE;
jk.KeyboardEvent.BLUR = jk.Event.BLUR;
jk.KeyboardEvent.ADDED_TO_STAGE = jk.Event.ADDED_TO_STAGE;
jk.KeyboardEvent.KEY_DOWN = "keyDown";
jk.KeyboardEvent.KEY_UP = "keyUp";
this.jk = this.jk || {};
var __$public$ducky_race$classdecl$var0 = function() {
    jk.EventDispatcher.call(this);
    var a = [" ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"];
    this.keysDown = {};
    document.onkeydown = function(b) {
        -1 < a.indexOf(b.key) && b.preventDefault();
        if (b.isTrusted || void 0 == b.isTrusted)
            this.keysDown[b.key] = !0,
            this.dispatchEvent(new jk.KeyboardEvent(jk.KeyboardEvent.KEY_DOWN,b,b.key));
        "Tab" == b.key ? document.styleSheets[0].cssRules[1].style.outline = "auto" : "Enter" == b.key && document.activeElement.dispatchEvent(new Event("click"))
    }
    .bind(this);
    document.onkeyup = function(a) {
        if (a.isTrusted || void 0 == a.isTrusted)
            this.keysDown[a.key] = !1,
            this.dispatchEvent(new jk.KeyboardEvent(jk.KeyboardEvent.KEY_UP,this,a.key))
    }
    .bind(this)
};
$jscomp.inherits(__$public$ducky_race$classdecl$var0, jk.EventDispatcher);
jk.Keyboard = new __$public$ducky_race$classdecl$var0;
jk.Keyboard.DOWN = "ArrowDown";
jk.Keyboard.ENTER = "Enter";
jk.Keyboard.LEFT = "ArrowLeft";
jk.Keyboard.RIGHT = "ArrowRight";
jk.Keyboard.SPACE = " ";
jk.Keyboard.UP = "ArrowUp";
this.jk = this.jk || {};
jk.MouseEvent = function(a, b, c, d) {
    jk.Event.call(this, a, b);
    this.stageX = c;
    this.stageY = d
}
;
$jscomp.inherits(jk.MouseEvent, jk.Event);
jk.MouseEvent.TIMER_COMPLETE = jk.Event.TIMER_COMPLETE;
jk.MouseEvent.TIMER = jk.Event.TIMER;
jk.MouseEvent.TICK = jk.Event.TICK;
jk.MouseEvent.REMOVED_FROM_STAGE = jk.Event.REMOVED_FROM_STAGE;
jk.MouseEvent.MOTION_CHANGE = jk.Event.MOTION_CHANGE;
jk.MouseEvent.INPUT = jk.Event.INPUT;
jk.MouseEvent.FILE_LOAD = jk.Event.FILE_LOAD;
jk.MouseEvent.FOCUS = jk.Event.FOCUS;
jk.MouseEvent.ENTER_FRAME = jk.Event.ENTER_FRAME;
jk.MouseEvent.COMPLETE = jk.Event.COMPLETE;
jk.MouseEvent.CHANGE = jk.Event.CHANGE;
jk.MouseEvent.BLUR = jk.Event.BLUR;
jk.MouseEvent.ADDED_TO_STAGE = jk.Event.ADDED_TO_STAGE;
jk.MouseEvent.CLICK = "click";
jk.MouseEvent.MOUSE_DOWN = "mouseDown";
jk.MouseEvent.MOUSE_ENTER = "mouseEnter";
jk.MouseEvent.MOUSE_LEAVE = "mouseLeave";
jk.MouseEvent.MOUSE_MOVE = "mouseMove";
jk.MouseEvent.MOUSE_UP = "mouseUp";
this.jk = this.jk || {};
jk.Preloader = function() {
    jk.EventDispatcher.call(this);
    this._count = 0;
    this._xhrs = []
}
;
$jscomp.inherits(jk.Preloader, jk.EventDispatcher);
jk.Preloader._getSourceId = function(a) {
    return /([^/]+)\..+$/.exec(a)[1]
}
;
jk.Preloader._getSourceType = function(a) {
    return /\.(.+)$/.exec(a)[1]
}
;
jk.Preloader.prototype._dispatchEvents = function() {
    this._count++;
    this.dispatchEvent(new jk.Event(jk.Event.FILE_LOAD,this));
    this._count == this._xhrs.length && this.dispatchEvent(new jk.Event(jk.Event.COMPLETE,this))
}
;
jk.Preloader.prototype.load = function(a) {
    var b = this
      , c = new XMLHttpRequest;
    c.open("GET", baseURL + a, !0);
    var d = jk.Preloader._getSourceType(a);
    "mp3" == d && (c.responseType = "arraybuffer");
    c.onload = function() {
        if ("mp3" == d) {
            var e = jk.Preloader._getSourceId(a);
            jk.Sound.loadBuffer(e, c.response, function() {
                b._dispatchEvents()
            }, function() {
                console.error("Error decoding audio data for " + a);
                b._dispatchEvents()
            })
        } else if ("svg" == d) {
            e = document.getElementById("defs");
            for (var f = (new DOMParser).parseFromString(c.response, "image/svg+xml"); f.firstChild.firstChild; )
                e.appendChild(f.firstChild.firstChild);
            b._dispatchEvents()
        }
    }
    ;
    c.send();
    this._xhrs.push(c)
}
;
jk.Preloader.prototype.loadManifest = function(a) {
    for (var b = 0; b < a.length; b++)
        this.load(a[b])
}
;
this.jk = this.jk || {};
var __$public$ducky_race$classdecl$var1 = function() {
    this.buffers = {};
    this.gainNode = this.context = null;
    this.sources = [];
    this._muted = !1
};
__$public$ducky_race$classdecl$var1.prototype.fadeOutAndStopAll = function(a) {
    this.getContext() && (new jk.Tween(this.gainNode.gain)).to({
        value: 0
    }, a, jk.Ease.quadOut).call(function() {
        for (var a = 0; a < this.sources.length; a++)
            this.sources[a].stop();
        this.sources = [];
        this.gainNode.gain.value = this._muted ? 0 : 1
    }
    .bind(this)).addEventListener(jk.Event.MOTION_CHANGE, function() {
        this._muted && (this.gainNode.gain.value = 0)
    }
    .bind(this))
}
;
__$public$ducky_race$classdecl$var1.prototype.getContext = function() {
    if ("Together" != arcademics.Settings.affiliate)
        return this.context || (this.context = new AudioContext,
        this.gainNode = this.context.createGain()),
        this.context
}
;
__$public$ducky_race$classdecl$var1.prototype.loadBuffer = function(a, b, c, d) {
    if (this.getContext()) {
        var e = this;
        this.context.decodeAudioData(b, function(b) {
            e.buffers[a] = b;
            c()
        }, function() {
            d()
        })
    } else
        d()
}
;
__$public$ducky_race$classdecl$var1.prototype.play = function(a, b, c) {
    if (this.getContext() && this.buffers.hasOwnProperty(a))
        try {
            var d = this.context.createBufferSource();
            d.buffer = this.buffers[a];
            d.loop = b;
            if (c) {
                var e = this.context.createPanner();
                e.setPosition(c, 0, 1 - Math.abs(c));
                d.connect(e);
                e.connect(this.gainNode)
            } else
                d.connect(this.gainNode);
            this.gainNode.connect(this.context.destination);
            d.start();
            this.sources.push(d)
        } catch (f) {
            console.error(f)
        }
}
;
__$public$ducky_race$classdecl$var1.prototype.resume = function() {
    if (this.getContext())
        return this.context.resume ? this.context.resume() : Promise.resolve()
}
;
__$public$ducky_race$classdecl$var1.prototype.stopAll = function() {
    for (var a = 0; a < this.sources.length; a++)
        this.sources[a].stop();
    this.sources = []
}
;
$jscomp.global.Object.defineProperties(__$public$ducky_race$classdecl$var1.prototype, {
    muted: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._muted
        },
        set: function(a) {
            this._muted = a;
            this.gainNode.gain.value = a ? 0 : 1
        }
    }
});
jk.Sound = new __$public$ducky_race$classdecl$var1;
this.jk = this.jk || {};
var __$public$ducky_race$classdecl$var2 = function() {
    function a() {
        cancelAnimationFrame(e);
        e = window.requestAnimationFrame(a);
        clearTimeout(f);
        f = setTimeout(a, b);
        var g = getTimer()
          , h = g - c;
        if (h > b) {
            var k = new jk.Event(jk.Event.TICK,d);
            k.delta = h;
            d.dispatchEvent(k);
            c = g - h % b
        }
    }
    jk.EventDispatcher.call(this);
    var b = 1E3 / 30
      , c = getTimer()
      , d = this;
    var e = window.requestAnimationFrame(a);
    var f = setTimeout(a, b)
};
$jscomp.inherits(__$public$ducky_race$classdecl$var2, jk.EventDispatcher);
jk.Ticker = new __$public$ducky_race$classdecl$var2;
this.jk = this.jk || {};
jk.Timer = function(a, b) {
    jk.EventDispatcher.call(this);
    void 0 == b && (b = 0);
    this._currentCount = 0;
    this._delay = a;
    this._intervalId = void 0;
    this._repeatCount = b;
    this._running = !1
}
;
$jscomp.inherits(jk.Timer, jk.EventDispatcher);
jk.Timer.prototype.reset = function() {
    this.stop();
    this._currentCount = 0
}
;
jk.Timer.prototype.start = function() {
    this._running || (this._intervalId = setInterval(function() {
        this.dispatchEvent(new jk.Event(jk.Event.TIMER,this));
        0 < this._repeatCount && this._currentCount >= this._repeatCount - 1 && (clearInterval(this._intervalId),
        this._running = !1,
        this.dispatchEvent(new jk.Event(jk.Event.TIMER_COMPLETE,this)));
        this._currentCount++
    }
    .bind(this), this._delay),
    this._running = !0)
}
;
jk.Timer.prototype.stop = function() {
    clearInterval(this._intervalId);
    this._running = !1
}
;
$jscomp.global.Object.defineProperties(jk.Timer.prototype, {
    currentCount: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._currentCount
        }
    },
    delay: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._delay
        },
        set: function(a) {
            this._delay = a
        }
    },
    repeatCount: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._repeatCount
        },
        set: function(a) {
            this._repeatCount = a
        }
    },
    running: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._running
        }
    }
});
this.jk = this.jk || {};
jk.Tween = function(a, b) {
    jk.EventDispatcher.call(this);
    this._loop = !1;
    this._stepIndex = 0;
    this._steps = [];
    this._target = a;
    void 0 != b && b.loop && (this._loop = b.loop);
    jk.Tween._inited || (jk.Tween._inited = !0,
    jk.Tween._tweens = [],
    jk.Ticker.addEventListener(jk.Event.TICK, jk.Tween._tick));
    jk.Tween._tweens.push(this)
}
;
$jscomp.inherits(jk.Tween, jk.EventDispatcher);
jk.Tween.get = function(a, b) {
    return new jk.Tween(a,b)
}
;
jk.Tween.removeAll = function() {
    jk.Tween._tweens = []
}
;
jk.Tween._tick = function(a) {
    for (var b = jk.Tween._tweens, c = 0; c < b.length; c++)
        for (var d = b[c], e = a.delta; d._stepIndex < d._steps.length && 0 < e; ) {
            var f = d._steps[d._stepIndex];
            if (0 == f.t)
                if (f.c)
                    f.c.bind(d)();
                else if (f.p) {
                    f.p0 = {};
                    for (var g in f.p)
                        "guide" != g && ("number" == typeof f.p[g] ? f.p0[g] = d._target[g] : d._target[g] = f.p[g])
                }
            f.t += e;
            f.t > f.d ? (e = f.t - f.d,
            f.t = f.d) : e = 0;
            if (f.p) {
                var h = 0 == f.d ? 1 : f.e(f.t / f.d);
                for (g in f.p)
                    if ("guide" == g) {
                        var k = f.guide.pathElement.getPointAtLength(h * f.guide.totalLength);
                        d._target.x = k.x;
                        d._target.y = k.y;
                        if ("auto" == f.guide.orient) {
                            var l = f.guide.pathElement.getPointAtLength(h * f.guide.totalLength * .99);
                            d._target.rotation = Math.atan2(k.y - l.y, k.x - l.x) / Math.PI * 180 + 90
                        }
                    } else
                        "number" == typeof f.p[g] && (d._target[g] = h * (f.p[g] - f.p0[g]) + f.p0[g])
            }
            f.t == f.d && (d._stepIndex += 1,
            d._loop && (f.t = 0,
            d._stepIndex >= d._steps.length && (d._stepIndex = 0)));
            d.dispatchEvent(new jk.Event(jk.Event.MOTION_CHANGE,d))
        }
}
;
jk.Tween.prototype.call = function(a, b) {
    this._steps.push({
        c: a,
        d: void 0 === b ? 0 : b,
        t: 0
    });
    return this
}
;
jk.Tween.prototype.remove = function() {
    for (var a = jk.Tween._tweens, b = 0; b < a.length; b++)
        if (a[b] == this) {
            a.splice(b, 1);
            break
        }
}
;
jk.Tween.prototype.to = function(a, b, c) {
    b = void 0 === b ? 0 : b;
    c = void 0 === c ? jk.Ease.linear : c;
    var d;
    for (d in a)
        if ("guide" == d) {
            var e = a[d].path;
            void 0 == e && (e = "");
            var f = a[d].orient;
            void 0 == f && (f = "fixed");
            var g = document.createElementNS(svgns, "path");
            g.setAttributeNS(null, "d", e);
            e = {
                pathElement: g,
                orient: f,
                totalLength: g.getTotalLength()
            }
        }
    this._steps.push({
        p: a,
        d: b,
        e: c,
        t: 0,
        guide: e
    });
    return this
}
;
jk.Tween.prototype.wait = function(a) {
    this._steps.push({
        w: !0,
        d: a,
        t: 0
    });
    return this
}
;
$jscomp.global.Object.defineProperties(jk.Tween.prototype, {
    target: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._target
        }
    }
});
this.jk = this.jk || {};
jk.DisplayObject = function() {
    jk.EventDispatcher.call(this);
    this._alpha = 1;
    this._domElement = this._ariaLive = this._ariaLabelledBy = this._ariaLabel = this._ariaHidden = this._ariaDescribedBy = this._ariaDisabled = this._ariaChecked = null;
    this._cursor = "default";
    this._filterId = null;
    this._filters = [];
    this._height0 = this._height = null;
    this._id = "";
    this._maskId = this._mask = null;
    this._mouseEnabled = !0;
    this._parent = null;
    this._pointerEvents = "auto";
    this._role = null;
    this._rotationY = this._rotationX = this._rotation = 0;
    this._scaleY = this._scaleX = 1;
    this._visible = !0;
    this._width0 = this._width = null;
    this._y = this._x = 0;
    this.addEventListener(jk.Event.ADDED_TO_STAGE, this._apply.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this._apply.bind(this))
}
;
$jscomp.inherits(jk.DisplayObject, jk.EventDispatcher);
jk.DisplayObject.getUID = function() {
    void 0 == jk.DisplayObject._nextUID && (jk.DisplayObject._nextUID = 0);
    return jk.DisplayObject._nextUID++
}
;
jk.DisplayObject.prototype.addEventListener = function(a, b) {
    jk.EventDispatcher.prototype.addEventListener.call(this, a, b);
    var c = this;
    a == jk.MouseEvent.CLICK ? (this._domElement.addEventListener("click", function(d) {
        c._mouseEnabled && (d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1])))
    }),
    this._domElement.addEventListener("touchend", function(d) {
        (d.isTrusted || void 0 == d.isTrusted) && c._mouseEnabled && (d.preventDefault(),
        1 == d.changedTouches.length && (d = d.changedTouches[0],
        d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1]))))
    }),
    this._domElement.setAttributeNS(null, "tabindex", 0)) : a == jk.MouseEvent.MOUSE_DOWN ? this._domElement.addEventListener("mousedown", function(d) {
        (d.isTrusted || void 0 == d.isTrusted) && c._mouseEnabled && (d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1])))
    }) : a == jk.MouseEvent.MOUSE_ENTER ? this._domElement.addEventListener("mouseenter", function(d) {
        (d.isTrusted || void 0 == d.isTrusted) && c._mouseEnabled && (d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1])))
    }) : a == jk.MouseEvent.MOUSE_LEAVE ? this._domElement.addEventListener("mouseleave", function(d) {
        (d.isTrusted || void 0 == d.isTrusted) && c._mouseEnabled && (d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1])))
    }) : a == jk.MouseEvent.MOUSE_MOVE ? this._domElement.addEventListener("mousemove", function(d) {
        (d.isTrusted || void 0 == d.isTrusted) && c._mouseEnabled && (d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1])))
    }) : a == jk.MouseEvent.MOUSE_UP && this._domElement.addEventListener("mouseup", function(d) {
        (d.isTrusted || void 0 == d.isTrusted) && c._mouseEnabled && (d = c.stage.clientToLocal(d.clientX, d.clientY),
        b(new jk.MouseEvent(a,c,d[0],d[1])))
    })
}
;
jk.DisplayObject.prototype.focus = function() {
    this._domElement.focus()
}
;
jk.DisplayObject.prototype.getRect = function() {
    var a = this._domElement.getBBox();
    return {
        bottom: this._y + a.y + a.height,
        height: a.height,
        left: this._x + a.x,
        right: this._x + a.x + a.width,
        top: this._y + a.y,
        width: a.width,
        x: a.x,
        y: a.y
    }
}
;
jk.DisplayObject.prototype.globalToLocal = function(a) {
    var b = document.getElementById("svg").createSVGPoint();
    b.x = a.x;
    b.y = a.y;
    return b.matrixTransform(this._domElement.getCTM().inverse())
}
;
jk.DisplayObject.prototype.hitTest = function(a, b) {
    return a > this.x && a < this.x + this.width && b > this.y && b < this.y + this.height
}
;
jk.DisplayObject.prototype.localToGlobal = function(a) {
    var b = document.getElementById("svg").createSVGPoint();
    b.x = a.x;
    b.y = a.y;
    return b.matrixTransform(this._domElement.getCTM())
}
;
jk.DisplayObject.prototype.removeAllEventListeners = function() {
    jk.EventDispatcher.prototype.removeAllEventListeners.call(this);
    this._domElement.removeAttributeNS(null, "tabindex")
}
;
jk.DisplayObject.prototype.removeEventListener = function(a, b) {
    jk.EventDispatcher.prototype.removeEventListener.call(this, a, b);
    a == jk.MouseEvent.CLICK && this._domElement.removeAttributeNS(null, "tabindex")
}
;
jk.DisplayObject.prototype._apply = function() {
    this._applyFilters();
    this._applyMask()
}
;
jk.DisplayObject.prototype._applyFilters = function() {
    if (null == this.stage || 0 == this._filters.length) {
        if (null != this._filterId) {
            this._domElement.removeAttributeNS(null, "filter");
            var a = document.getElementById("filter" + this._filterId);
            a.parentNode.removeChild(a);
            this._filterId = null
        }
    } else {
        null == this._filterId ? (this._filterId = jk.DisplayObject.getUID(),
        a = document.createElementNS(svgns, "filter"),
        a.setAttributeNS(null, "id", "filter" + this._filterId),
        a.setAttributeNS(null, "x", "-50%"),
        a.setAttributeNS(null, "y", "-50%"),
        a.setAttributeNS(null, "width", "200%"),
        a.setAttributeNS(null, "height", "200%"),
        document.getElementById("svg").appendChild(a),
        this._domElement.setAttributeNS(null, "filter", "url(#filter" + this._filterId + ")")) : a = document.getElementById("filter" + this._filterId);
        for (; a.firstChild; )
            a.removeChild(a.firstChild);
        for (var b = 0; b < this._filters.length; b++) {
            var c = this._filters[b];
            if (c instanceof jk.BlurFilter) {
                var d = document.createElementNS(svgns, "feGaussianBlur");
                d.setAttributeNS(null, "stdDeviation", c.stdDeviation);
                a.appendChild(d);
                if (1 < c.strength) {
                    d = document.createElementNS(svgns, "feMerge");
                    a.appendChild(d);
                    for (b = 0; b < c.strength + 1; b++) {
                        var e = document.createElementNS(svgns, "feMergeNode");
                        d.appendChild(e)
                    }
                    e.setAttributeNS(null, "in", "SourceGraphic")
                }
            } else if (c instanceof jk.ColorMatrixFilter)
                d = document.createElementNS(svgns, "feColorMatrix"),
                d.setAttributeNS(null, "values", c.values),
                a.appendChild(d);
            else if (c instanceof jk.GlowFilter) {
                d = document.createElementNS(svgns, "feColorMatrix");
                d.setAttributeNS(null, "values", c.values);
                a.appendChild(d);
                d = document.createElementNS(svgns, "feGaussianBlur");
                d.setAttributeNS(null, "stdDeviation", c.stdDeviation);
                a.appendChild(d);
                d = document.createElementNS(svgns, "feMerge");
                a.appendChild(d);
                for (b = 0; b < c.strength + 1; b++)
                    e = document.createElementNS(svgns, "feMergeNode"),
                    d.appendChild(e);
                e.setAttributeNS(null, "in", "SourceGraphic")
            }
        }
    }
}
;
jk.DisplayObject.prototype._applyMask = function() {
    if (null == this.stage || null == this._mask) {
        if (null != this._maskId) {
            this._domElement.removeAttributeNS(null, "mask");
            var a = document.getElementById("mask" + this._maskId);
            a.parentNode.removeChild(a);
            this._maskId = null
        }
    } else {
        null == this._maskId ? (this._maskId = jk.DisplayObject.getUID(),
        a = document.createElementNS(svgns, "mask"),
        a.setAttributeNS(null, "id", "mask" + this._maskId),
        document.getElementById("svg").appendChild(a),
        this._domElement.setAttributeNS(null, "mask", "url(#mask" + this._maskId + ")")) : a = document.getElementById("mask" + this._maskId);
        for (; a.firstChild; )
            a.removeChild(a.firstChild);
        a.appendChild(this._mask._domElement)
    }
}
;
jk.DisplayObject.prototype._calcInitDimensions = function() {
    var a = this._domElement.getBBox();
    this._height0 = this._height = a.height;
    this._width0 = this._width = a.width
}
;
jk.DisplayObject.prototype._tick = function() {
    this.dispatchEvent(new jk.Event(jk.Event.ENTER_FRAME,this))
}
;
jk.DisplayObject.prototype._updateTransform = function() {
    this._domElement.setAttributeNS(null, "transform", "translate(" + this._x + ", " + this._y + ") scale(" + this._scaleX + ", " + this._scaleY + ") rotate(" + this._rotation + " " + this._rotationX + " " + this._rotationY + ")")
}
;
$jscomp.global.Object.defineProperties(jk.DisplayObject.prototype, {
    alpha: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._alpha
        },
        set: function(a) {
            this._alpha = a;
            this._domElement.setAttributeNS(null, "opacity", a)
        }
    },
    ariaChecked: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaChecked
        },
        set: function(a) {
            this._ariaChecked = a;
            this._domElement.setAttributeNS(null, "aria-checked", a)
        }
    },
    ariaDescribedBy: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaDescribedBy
        },
        set: function(a) {
            this._ariaDescribedBy = a;
            this._domElement.setAttributeNS(null, "aria-describedby", a)
        }
    },
    ariaDisabled: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaDisabled
        },
        set: function(a) {
            (this._ariaDisabled = a) ? this._domElement.setAttributeNS(null, "aria-disabled", a) : this._domElement.removeAttributeNS(null, "aria-disabled")
        }
    },
    ariaHidden: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaHidden
        },
        set: function(a) {
            (this._ariaHidden = a) ? this._domElement.setAttributeNS(null, "aria-hidden", a) : this._domElement.removeAttributeNS(null, "aria-hidden")
        }
    },
    ariaLabel: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaLabel
        },
        set: function(a) {
            this._ariaLabel = a;
            this._domElement.setAttributeNS(null, "aria-label", a)
        }
    },
    ariaLabelledBy: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaLabelledBy
        },
        set: function(a) {
            this._ariaLabelledBy = a;
            this._domElement.setAttributeNS(null, "aria-labelledby", a)
        }
    },
    ariaLive: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaLive
        },
        set: function(a) {
            this._ariaLive = a;
            this._domElement.setAttributeNS(null, "aria-live", a)
        }
    },
    cursor: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._cursor
        },
        set: function(a) {
            this._cursor = a;
            this._domElement.setAttributeNS(null, "cursor", a)
        }
    },
    filters: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._filters
        },
        set: function(a) {
            this._filters = a;
            this._applyFilters()
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return null == this._height && this._domElement ? this._domElement.getBBox().height : this._height
        },
        set: function(a) {
            this._height = a;
            this._scaleY = a / this._height0 * (0 < this._scaleY ? 1 : -1);
            this._updateTransform()
        }
    },
    id: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._id
        },
        set: function(a) {
            this._id = a;
            this._domElement.id = a
        }
    },
    mask: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._mask
        },
        set: function(a) {
            this._mask = a;
            this._applyMask()
        }
    },
    mouseEnabled: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._mouseEnabled
        },
        set: function(a) {
            this._mouseEnabled = a
        }
    },
    parent: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._parent
        }
    },
    pointerEvents: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._pointerEvents
        },
        set: function(a) {
            this._pointerEvents = a;
            this._domElement.setAttributeNS(null, "pointer-events", a)
        }
    },
    rotation: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._rotation
        },
        set: function(a) {
            var b = a % 360;
            this._rotation = 180 < b ? b - 360 : -180 > b ? b + 360 : a;
            this._updateTransform()
        }
    },
    scaleX: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._scaleX
        },
        set: function(a) {
            this._scaleX = a;
            this._width = Math.abs(this._width0 * a);
            this._updateTransform()
        }
    },
    scaleY: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._scaleY
        },
        set: function(a) {
            this._scaleY = a;
            this._height = Math.abs(this._height0 * a);
            this._updateTransform()
        }
    },
    role: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._role
        },
        set: function(a) {
            this._role = a;
            this._domElement.setAttributeNS(null, "role", a)
        }
    },
    stage: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._parent ? this._parent.stage : null
        }
    },
    visible: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._visible
        },
        set: function(a) {
            (this._visible = a) ? this._domElement.removeAttributeNS(null, "visibility") : this._domElement.setAttributeNS(null, "visibility", "hidden")
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return null == this._width && this._domElement ? this._domElement.getBBox().width : this._width
        },
        set: function(a) {
            this._width = a;
            this._scaleX = a / this._width0 * (0 < this._scaleX ? 1 : -1);
            this._updateTransform()
        }
    },
    x: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._x
        },
        set: function(a) {
            this._x = a;
            this._updateTransform()
        }
    },
    y: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._y
        },
        set: function(a) {
            this._y = a;
            this._updateTransform()
        }
    }
});
this.jk = this.jk || {};
jk.Container = function(a) {
    jk.DisplayObject.call(this);
    this._children = [];
    a || (this._domElement = document.createElementNS(svgns, "g"),
    document.getElementById("temp").appendChild(this._domElement))
}
;
$jscomp.inherits(jk.Container, jk.DisplayObject);
jk.Container.getUID = jk.DisplayObject.getUID;
jk.Container._nextUID = jk.DisplayObject._nextUID;
jk.Container.prototype.addChild = function(a) {
    this._children.push(a);
    a._domElement.parentNode && a._domElement.parentNode.removeChild(a._domElement);
    this._domElement.appendChild(a._domElement);
    a._parent = this;
    if (null != a.stage)
        for (var b = [a]; 0 < b.length; ) {
            var c = b.shift();
            b.unshift.apply(b, c.children);
            c.dispatchEvent(new jk.Event(jk.Event.ADDED_TO_STAGE,c))
        }
    return a
}
;
jk.Container.prototype.addChildAt = function(a, b) {
    this._children.splice(b, 0, a);
    a._domElement.parentNode && a._domElement.parentNode.removeChild(a._domElement);
    this._domElement.insertBefore(a._domElement, this._domElement.childNodes[b]);
    a._parent = this;
    if (null != a.stage)
        for (b = [a]; 0 < b.length; ) {
            var c = b.shift();
            b.unshift.apply(b, c.children);
            c.dispatchEvent(new jk.Event(jk.Event.ADDED_TO_STAGE,c))
        }
    return a
}
;
jk.Container.prototype.contains = function(a) {
    return 0 <= this._children.indexOf(a)
}
;
jk.Container.prototype.getChildAt = function(a) {
    return this._children[a]
}
;
jk.Container.prototype.getChildIndex = function(a) {
    if (-1 == this._children.indexOf(a))
        throw "The child parameter is not a child of this object";
    return this._children.indexOf(a)
}
;
jk.Container.prototype.setChildIndex = function(a, b) {
    var c = this._children.indexOf(a);
    -1 < c && this._children[b] != a && (this._children.splice(c, 1),
    this._children.splice(b, 0, a),
    this._domElement.removeChild(a._domElement),
    this._domElement.insertBefore(a._domElement, this._domElement.childNodes[b]))
}
;
jk.Container.prototype.removeAllChildren = function() {
    for (; 0 < this._children.length; )
        this.removeChild(this._children[0])
}
;
jk.Container.prototype.removeChild = function(a) {
    for (var b = 0; b < this._children.length; b++)
        if (this._children[b] == a) {
            this._children.splice(b, 1);
            this._domElement.removeChild(a._domElement);
            a._parent = null;
            for (b = [a]; 0 < b.length; ) {
                var c = b.shift();
                b.unshift.apply(b, c.children);
                c.dispatchEvent(new jk.Event(jk.Event.REMOVED_FROM_STAGE,c))
            }
            return a
        }
}
;
jk.Container.prototype._tick = function() {
    this.dispatchEvent(new jk.Event(jk.Event.ENTER_FRAME,this));
    for (var a = 0; a < this._children.length; a++)
        this._children[a]._tick()
}
;
$jscomp.global.Object.defineProperties(jk.Container.prototype, {
    children: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._children
        }
    },
    numChildren: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._children.length
        }
    }
});
this.jk = this.jk || {};
jk.ForeignObject = function() {
    jk.DisplayObject.call(this);
    this._color = "#000000";
    this._fontFamily = "Arial";
    this._fontSize = 12;
    this._text = "";
    this._textAlign = "left";
    this._domElement = document.createElementNS(svgns, "foreignObject");
    this._domElement.style["box-sizing"] = "border-box";
    this._domElement.style.color = this._color;
    this._domElement.style["font-family"] = this._fontFamily;
    this._domElement.style["font-size"] = this._fontSize + "px";
    this._domElement.style.height = "40px";
    this._domElement.style["user-select"] = "none";
    this._domElement.style.width = "248px";
    document.getElementById("temp").appendChild(this._domElement)
}
;
$jscomp.inherits(jk.ForeignObject, jk.DisplayObject);
jk.ForeignObject.getUID = jk.DisplayObject.getUID;
jk.ForeignObject._nextUID = jk.DisplayObject._nextUID;
$jscomp.global.Object.defineProperties(jk.ForeignObject.prototype, {
    color: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._color
        },
        set: function(a) {
            this._color = a;
            this._domElement.style.color = a
        }
    },
    fontFamily: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontFamily
        },
        set: function(a) {
            this._fontFamily = a;
            this._domElement.style["font-family"] = a
        }
    },
    fontSize: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontSize
        },
        set: function(a) {
            this._fontSize = a;
            this._domElement.style["font-size"] = a + "px"
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this._domElement.style.height = a;
            this._domElement.setAttributeNS(null, "height", a)
        }
    },
    innerHTML: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._innerHTML
        },
        set: function(a) {
            this._domElement.innerHTML = a
        }
    },
    textAlign: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._textAlign
        },
        set: function(a) {
            this._textAlign = a;
            this._domElement.style["text-align"] = a
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this._domElement.style.width = a;
            this._domElement.setAttributeNS(null, "width", a)
        }
    }
});
this.jk = this.jk || {};
jk.Image = function(a, b, c) {
    jk.DisplayObject.call(this);
    this._domElement = document.createElementNS(svgns, "image");
    this._domElement.setAttributeNS(xlinkns, "href", a);
    this._domElement.setAttributeNS(null, "width", b);
    this._domElement.setAttributeNS(null, "height", c);
    document.getElementById("temp").appendChild(this._domElement);
    this._calcInitDimensions()
}
;
$jscomp.inherits(jk.Image, jk.DisplayObject);
jk.Image.getUID = jk.DisplayObject.getUID;
jk.Image._nextUID = jk.DisplayObject._nextUID;
this.jk = this.jk || {};
jk.PrintJob = function(a) {
    jk.Container.apply(this, arguments)
}
;
$jscomp.inherits(jk.PrintJob, jk.Container);
jk.PrintJob.getUID = jk.Container.getUID;
jk.PrintJob._nextUID = jk.Container._nextUID;
jk.PrintJob.prototype.send = function() {
    var a = document.getElementById("svg")
      , b = a.getAttributeNS(null, "viewBox");
    a.removeAttributeNS(null, "viewBox", "none");
    this._domElement.setAttributeNS(null, "id", "print");
    a.appendChild(this._domElement);
    window.print();
    a.setAttributeNS(null, "viewBox", b);
    a.removeChild(this._domElement)
}
;
this.jk = this.jk || {};
jk.Shape = function() {
    jk.DisplayObject.call(this);
    this._gradientId = this._gradient = null;
    this.addEventListener(jk.Event.ADDED_TO_STAGE, this._applyGradient.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this._applyGradient.bind(this))
}
;
$jscomp.inherits(jk.Shape, jk.DisplayObject);
jk.Shape.getUID = jk.DisplayObject.getUID;
jk.Shape._nextUID = jk.DisplayObject._nextUID;
jk.Shape.prototype.setAttribute = function(a, b) {
    "fill" == a ? b instanceof jk.Gradient ? (this._gradient = b,
    this._applyGradient()) : (this._gradient = null,
    this._applyGradient(),
    this._domElement.setAttributeNS(null, a, b)) : this._domElement.setAttributeNS(null, a, b)
}
;
jk.Shape.prototype.setAttributes = function(a) {
    for (var b in a)
        this.setAttribute(b, a[b])
}
;
jk.Shape.prototype.removeAttribute = function(a) {
    this._domElement.removeAttributeNS(null, a)
}
;
jk.Shape.prototype._applyGradient = function() {
    if (null == this.stage || null == this._gradient) {
        if (null != this._gradientId) {
            this._domElement.removeAttributeNS(null, "fill");
            var a = document.getElementById("gradient" + this._gradientId);
            a.parentNode.removeChild(a);
            this._gradientId = null
        }
    } else {
        null == this._gradientId ? (this._gradientId = jk.DisplayObject.getUID(),
        a = document.createElementNS(svgns, this._gradient.type),
        a.setAttributeNS(null, "id", "gradient" + this._gradientId),
        document.getElementById("svg").appendChild(a),
        this._domElement.setAttributeNS(null, "fill", "url(#gradient" + this._gradientId + ")")) : a = document.getElementById("gradient" + this._gradientId);
        for (void 0 != this._gradient.rotation ? a.setAttributeNS(null, "gradientTransform", "rotate(" + this._gradient.rotation + ")") : a.removeAttributeNS(null, "gradientTransform"); a.firstChild; )
            a.removeChild(a.firstChild);
        for (var b = 0; b < this._gradient.colors.length; b++) {
            var c = document.createElementNS(svgns, "stop");
            c.setAttributeNS(null, "offset", this._gradient.ratios[b]);
            c.setAttributeNS(null, "stop-color", this._gradient.colors[b]);
            c.setAttributeNS(null, "stop-opacity", this._gradient.alphas[b]);
            a.appendChild(c)
        }
    }
}
;
this.jk = this.jk || {};
jk.Ellipse = function(a, b, c, d, e) {
    jk.Shape.call(this);
    this._domElement = document.createElementNS(svgns, "ellipse");
    isNaN(a) || (this.cx = a);
    isNaN(b) || (this.cy = b);
    isNaN(c) || (this.rx = c);
    isNaN(d) || (this.ry = d);
    this.setAttributes(e)
}
;
$jscomp.inherits(jk.Ellipse, jk.Shape);
jk.Ellipse.getUID = jk.Shape.getUID;
jk.Ellipse._nextUID = jk.Shape._nextUID;
$jscomp.global.Object.defineProperties(jk.Ellipse.prototype, {
    cx: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "cx"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "cx", a)
        }
    },
    cy: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "cy"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "cy", a)
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 2 * this.ry
        },
        set: function(a) {
            this.ry = a / 2
        }
    },
    rx: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "rx"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "rx", a)
        }
    },
    ry: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "ry"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "ry", a)
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 2 * this.rx
        },
        set: function(a) {
            this.rx = a / 2
        }
    },
    x: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.cx
        },
        set: function(a) {
            this.cx = a
        }
    },
    y: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.cy
        },
        set: function(a) {
            this.cy = a
        }
    }
});
this.jk = this.jk || {};
jk.Path = function(a, b) {
    jk.Shape.call(this);
    this._domElement = document.createElementNS(svgns, "path");
    this.d = a;
    this.setAttributes(b)
}
;
$jscomp.inherits(jk.Path, jk.Shape);
jk.Path.getUID = jk.Shape.getUID;
jk.Path._nextUID = jk.Shape._nextUID;
$jscomp.global.Object.defineProperties(jk.Path.prototype, {
    d: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._domElement.getAttributeNS(null, "d")
        },
        set: function(a) {
            "" == a && (a = "M 0 0");
            this._domElement.setAttributeNS(null, "d", a)
        }
    }
});
this.jk = this.jk || {};
jk.Rect = function(a, b, c, d, e, f, g) {
    jk.Shape.call(this);
    "object" == typeof e && (g = e,
    e = void 0);
    this._domElement = document.createElementNS(svgns, "rect");
    isNaN(a) || (this.x = a);
    isNaN(b) || (this.y = b);
    isNaN(c) || (this.width = c);
    isNaN(d) || (this.height = d);
    isNaN(e) || (this.rx = e);
    isNaN(f) || (this.ry = f);
    this.setAttributes(g)
}
;
$jscomp.inherits(jk.Rect, jk.Shape);
jk.Rect.getUID = jk.Shape.getUID;
jk.Rect._nextUID = jk.Shape._nextUID;
$jscomp.global.Object.defineProperties(jk.Rect.prototype, {
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "height"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "height", a)
        }
    },
    rx: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "rx"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "rx", a)
        }
    },
    ry: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "ry"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "ry", a)
        }
    },
    x: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "x"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "x", a)
        }
    },
    y: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "y"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "y", a)
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Number(this._domElement.getAttributeNS(null, "width"))
        },
        set: function(a) {
            this._domElement.setAttributeNS(null, "width", a)
        }
    }
});
this.jk = this.jk || {};
jk.Stage = function(a, b) {
    jk.Container.call(this, !0);
    this._width0 = this._width = a;
    this._height0 = this._height = b;
    var c = document.createElementNS(svgns, "svg");
    c.setAttributeNS(null, "id", "svg");
    c.setAttributeNS(null, "width", "100%");
    c.setAttributeNS(null, "height", "100%");
    c.setAttributeNS(null, "viewBox", "0 0 " + a + " " + b);
    document.body.appendChild(c);
    var d = document.createElementNS(svgns, "defs");
    d.setAttributeNS(null, "id", "defs");
    d.setAttributeNS(null, "visibility", "hidden");
    c.appendChild(d);
    this._rect = document.createElementNS(svgns, "rect");
    this._rect.setAttributeNS(null, "x", 0);
    this._rect.setAttributeNS(null, "y", 0);
    this._rect.setAttributeNS(null, "width", a);
    this._rect.setAttributeNS(null, "height", b);
    this._rect.setAttributeNS(null, "visibility", "hidden");
    c.appendChild(this._rect);
    a = document.createElementNS(svgns, "g");
    a.setAttributeNS(null, "id", "temp");
    a.setAttributeNS(null, "visibility", "hidden");
    c.appendChild(a);
    this._domElement = document.createElementNS(svgns, "g");
    this._domElement.setAttributeNS(null, "id", "main");
    c.appendChild(this._domElement);
    jk.Ticker.addEventListener(jk.Event.TICK, this._tick.bind(this))
}
;
$jscomp.inherits(jk.Stage, jk.Container);
jk.Stage.getUID = jk.Container.getUID;
jk.Stage._nextUID = jk.Container._nextUID;
jk.Stage.prototype.clientToLocal = function(a, b) {
    var c = this._rect.getBoundingClientRect();
    return [(a - c.left) * this._width / c.width, (b - c.top) * this._height / c.height]
}
;
jk.Stage.prototype._tick = function(a) {
    jk.Container.prototype._tick.call(this)
}
;
$jscomp.global.Object.defineProperties(jk.Stage.prototype, {
    stage: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this
        }
    }
});
this.jk = this.jk || {};
jk.SVG = function(a) {
    jk.DisplayObject.call(this);
    this._id = a;
    this._patternId = null;
    this._doOnce = !1;
    this._domElement = document.createElementNS(svgns, "use");
    this._domElement.setAttributeNS(xlinkns, "href", "#" + a);
    document.getElementById("temp").appendChild(this._domElement);
    this._calcInitDimensions()
}
;
$jscomp.inherits(jk.SVG, jk.DisplayObject);
jk.SVG.getUID = jk.DisplayObject.getUID;
jk.SVG._nextUID = jk.DisplayObject._nextUID;
jk.SVG.prototype._applyPattern = function() {
    if (null == this.stage || null == this._pattern) {
        if (null != this._patternId) {
            this._domElement.removeAttributeNS(null, "fill");
            var a = document.getElementById("pattern" + this._patternId);
            a.parentNode.removeChild(a);
            this._patternId = null
        }
    } else {
        null == this._patternId ? (this._patternId = jk.DisplayObject.getUID(),
        a = document.createElementNS(svgns, "pattern"),
        a.setAttributeNS(null, "id", "pattern" + this._patternId),
        a.setAttributeNS(null, "width", "100%"),
        a.setAttributeNS(null, "height", "100%"),
        document.getElementById("svg").appendChild(a),
        this._domElement.setAttributeNS(null, "fill", "url(#pattern" + this._patternId + ")")) : a = document.getElementById("pattern" + this._patternId);
        for (; a.firstChild; )
            a.removeChild(a.firstChild);
        var b = document.createElementNS(svgns, "use");
        b.setAttributeNS(xlinkns, "href", "#" + this._pattern);
        a.appendChild(b)
    }
}
;
$jscomp.global.Object.defineProperties(jk.SVG.prototype, {
    id: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._id
        },
        set: function(a) {
            this._id = a;
            this._domElement.setAttributeNS(xlinkns, "href", "#" + a)
        }
    },
    color: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._color
        },
        set: function(a) {
            this._color = a;
            a in jk.SVG.patternMap ? (this._pattern = jk.SVG.patternMap[a],
            this._applyPattern(),
            this._doOnce || (this.addEventListener(jk.Event.ADDED_TO_STAGE, this._applyPattern.bind(this)),
            this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this._applyPattern.bind(this)),
            this._doOnce = !0)) : (this._pattern = null,
            this._applyPattern(),
            this._domElement.setAttributeNS(null, "fill", a))
        }
    }
});
jk.SVG.patternMap = {
    "#222222": "PatternBlack",
    "#FF00FF": "PatternRainbow",
    "#EE4477": "PatternHearts",
    "#33CC00": "PatternDollars",
    "#3300FF": "PatternStars"
};
this.jk = this.jk || {};
jk.Text = function() {
    jk.DisplayObject.call(this);
    this._color = "#000000";
    this._direction = "auto";
    this._fontFamily = "Arial";
    this._fontSize = 12;
    this._letterSpacing = this._fontWeight = this._fontStyle = "normal";
    this._multiline = !1;
    this._text = "";
    this._textAlign = "left";
    this._textDecoration = "none";
    this._domElement = document.createElementNS(svgns, "text");
    this._domElement.setAttributeNS(null, "dy", "1em");
    this._domElement.setAttributeNS(null, "fill", this._color);
    this._domElement.setAttributeNS(null, "font-family", this._fontFamily);
    this._domElement.setAttributeNS(null, "font-size", this._fontSize);
    this._domElement.style["white-space"] = "pre";
    document.getElementById("temp").appendChild(this._domElement)
}
;
$jscomp.inherits(jk.Text, jk.DisplayObject);
jk.Text.getUID = jk.DisplayObject.getUID;
jk.Text._nextUID = jk.DisplayObject._nextUID;
jk.Text.prototype.setNewTextFormat = function(a, b, c) {
    b = [this._text.substring(0, b), this._text.substring(b, c), this._text.substring(c)];
    if ("" != b[1]) {
        this._domElement.textContent = "";
        "" != b[0] && (c = document.createTextNode(b[0]),
        this._domElement.appendChild(c));
        c = document.createElementNS(svgns, "tspan");
        for (var d in a)
            c.setAttributeNS(null, d, a[d]);
        c.textContent = b[1];
        this._domElement.appendChild(c);
        "" != b[2] && (c = document.createTextNode(b[2]),
        this._domElement.appendChild(c))
    }
}
;
jk.Text.prototype._update = function() {
    if (this._multiline)
        try {
            var a = this._text.split(/\n\r|\n|\r/).reverse();
            if (1 < a.length) {
                this._domElement.textContent = "";
                for (var b = 0, c = this.fontSize + 4, d = this.fontSize; h = a.pop(); ) {
                    var e = document.createElementNS(svgns, "tspan");
                    e.setAttributeNS(null, "x", 0);
                    e.setAttributeNS(null, "y", 0);
                    e.setAttributeNS(null, "dy", b * c + d);
                    e.textContent = h;
                    this._domElement.appendChild(e);
                    b += 1
                }
            }
            if (this._width && this._domElement.getBBox().width > this._width) {
                this._domElement.textContent = "";
                var f = this._text.split(/\s+/).reverse()
                  , g = f.pop()
                  , h = [g];
                b = 0;
                c = this.fontSize + 4;
                d = this.fontSize;
                e = document.createElementNS(svgns, "tspan");
                e.setAttributeNS(null, "x", 0);
                e.setAttributeNS(null, "y", 0);
                e.setAttributeNS(null, "dy", d);
                e.textContent = g;
                for (this._domElement.appendChild(e); g = f.pop(); )
                    h.push(g),
                    e.textContent = h.join(" "),
                    e.getComputedTextLength() > this._width && (h.pop(),
                    e.textContent = h.join(" "),
                    h = [g],
                    b += 1,
                    e = document.createElementNS(svgns, "tspan"),
                    e.setAttributeNS(null, "x", 0),
                    e.setAttributeNS(null, "y", 0),
                    e.setAttributeNS(null, "dy", b * c + d),
                    e.textContent = g,
                    this._domElement.appendChild(e))
            }
        } catch (k) {}
    else
        this._width && this._domElement.getBBox().width > this._width && (this._domElement.setAttributeNS(null, "lengthAdjust", "spacingAndGlyphs"),
        this._domElement.setAttributeNS(null, "textLength", this._width));
    this._rotationX = "center" == this._textAlign ? 0 : "right" == this._textAlign ? -this.width / 2 : this.width / 2;
    this._rotationY = this.height / 2
}
;
$jscomp.global.Object.defineProperties(jk.Text.prototype, {
    color: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._color
        },
        set: function(a) {
            this._color = a;
            this._domElement.setAttributeNS(null, "fill", a)
        }
    },
    direction: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._direction
        },
        set: function(a) {
            this._direction = a;
            this._domElement.setAttributeNS(null, "direction", a);
            this._update()
        }
    },
    fontFamily: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontFamily
        },
        set: function(a) {
            this._fontFamily = a;
            this._domElement.setAttributeNS(null, "font-family", a);
            this._update()
        }
    },
    fontSize: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontSize
        },
        set: function(a) {
            this._fontSize = a;
            this._domElement.setAttributeNS(null, "font-size", a);
            this._update()
        }
    },
    fontStyle: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontStyle
        },
        set: function(a) {
            this._fontStyle = a;
            this._domElement.setAttributeNS(null, "font-style", a);
            this._update()
        }
    },
    fontWeight: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontWeight
        },
        set: function(a) {
            this._fontWeight = a;
            this._domElement.setAttributeNS(null, "font-weight", a);
            this._update()
        }
    },
    letterSpacing: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._letterSpacing
        },
        set: function(a) {
            this._letterSpacing = a;
            this._domElement.setAttributeNS(null, "letter-spacing", a);
            this._update()
        }
    },
    multiline: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._multiline
        },
        set: function(a) {
            this._multiline = a;
            this._update()
        }
    },
    text: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._text
        },
        set: function(a) {
            this._text = a;
            this._domElement.textContent = a;
            this._update()
        }
    },
    textAlign: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._textAlign
        },
        set: function(a) {
            this._textAlign = a;
            "center" == this._textAlign ? this._domElement.setAttributeNS(null, "text-anchor", "middle") : "right" == this._textAlign ? this._domElement.setAttributeNS(null, "text-anchor", "end") : this._domElement.removeAttributeNS(null, "text-anchor");
            this._update()
        }
    },
    textDecoration: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._textDecoration
        },
        set: function(a) {
            this._textDecoration = a;
            this._domElement.setAttributeNS(null, "text-decoration", a);
            this._update()
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return null == this._width && this._domElement ? this._domElement.getBBox().width : this._width
        },
        set: function(a) {
            this._width = a;
            this._update()
        }
    }
});
this.jk = this.jk || {};
jk.TextInput = function() {
    jk.DisplayObject.call(this);
    var a = this;
    this._color = "#000000";
    this._fontFamily = "Arial";
    this._fontSize = 12;
    this._maxLength = null;
    this._readOnly = !1;
    this._text = "";
    this._textAlign = "left";
    this._type = "text";
    this._domElement = document.createElementNS(svgns, "foreignObject");
    this._input = document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    this._input.setAttribute("type", this._type);
    this._input.setAttribute("spellcheck", !1);
    this._input.style.border = "none";
    this._input.style["box-sizing"] = "border-box";
    this._input.style.color = this._color;
    this._input.style["font-family"] = this._fontFamily;
    this._input.style["font-size"] = this._fontSize + "px";
    this._input.style.height = "100%";
    this._input.style.outline = "none";
    this._input.style.padding = "4px 6px";
    this._input.style.width = "100%";
    this._domElement.appendChild(this._input);
    isIE() && (this._domElement = document.createElementNS(svgns, "g"),
    this.addEventListener(jk.Event.ADDED_TO_STAGE, function() {
        var b = a._domElement.getBoundingClientRect();
        a.visible || (a._input.style.display = "none");
        a._input.style.position = "fixed";
        a._input.style.left = b.left;
        a._input.style.top = b.top;
        document.body.appendChild(a._input)
    }),
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, function() {
        document.body.removeChild(a._input)
    }))
}
;
$jscomp.inherits(jk.TextInput, jk.DisplayObject);
jk.TextInput.getUID = jk.DisplayObject.getUID;
jk.TextInput._nextUID = jk.DisplayObject._nextUID;
jk.TextInput.prototype.addEventListener = function(a, b) {
    jk.DisplayObject.prototype.addEventListener.call(this, a, b);
    var c = this;
    a == jk.Event.BLUR ? this._input.addEventListener("blur", function(a) {
        b(new jk.Event(jk.Event.BLUR,c))
    }) : a == jk.Event.CHANGE ? this._input.addEventListener("change", function(a) {
        b(new jk.Event(jk.Event.CHANGE,c))
    }) : a == jk.Event.FOCUS ? this._input.addEventListener("focus", function(a) {
        b(new jk.Event(jk.Event.FOCUS,c))
    }) : a == jk.Event.INPUT && this._input.addEventListener("input", function(a) {
        b(new jk.Event(jk.Event.INPUT,c))
    })
}
;
jk.TextInput.prototype.focus = function() {
    this._input.focus()
}
;
jk.TextInput.prototype.setSelection = function(a, b) {
    this._input.setSelectionRange(a, b)
}
;
$jscomp.global.Object.defineProperties(jk.TextInput.prototype, {
    ariaLabel: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._ariaLabel
        },
        set: function(a) {
            this._ariaLabel = a;
            this._input.setAttributeNS(null, "aria-label", a)
        }
    },
    caretIndex: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._input.selectionStart
        }
    },
    color: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._color
        },
        set: function(a) {
            this._color = a;
            this._input.style.color = a
        }
    },
    fontFamily: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontFamily
        },
        set: function(a) {
            this._fontFamily = a;
            this._input.style["font-family"] = a
        }
    },
    fontSize: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._fontSize
        },
        set: function(a) {
            this._fontSize = a;
            this._input.style["font-size"] = a + "px"
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this._input.style.height = a;
            this._domElement.setAttributeNS(null, "height", a)
        }
    },
    maxLength: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._maxLength
        },
        set: function(a) {
            this._maxLength = a;
            this._input.setAttribute("maxLength", a)
        }
    },
    readOnly: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._readOnly
        },
        set: function(a) {
            this._readOnly = a;
            this._input.setAttribute("readOnly", a);
            this._input.style.userSelect = a ? "none" : "auto"
        }
    },
    text: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._input.value
        },
        set: function(a) {
            this._text = a;
            this._input.value = a
        }
    },
    textAlign: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._textAlign
        },
        set: function(a) {
            this._textAlign = a;
            this._input.style["text-align"] = a
        }
    },
    type: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._type
        },
        set: function(a) {
            this._type = a;
            this._input.setAttribute("type", a)
        }
    },
    visible: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._visible
        },
        set: function(a) {
            (this._visible = a) ? this._domElement.removeAttributeNS(null, "visibility") : this._domElement.setAttributeNS(null, "visibility", "hidden");
            isIE() && (this._input.style.display = a ? "inline-block" : "none")
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this._input.style.width = a;
            this._domElement.setAttributeNS(null, "width", a)
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.ContentType = function() {
    throw "ContentType cannot be instantiated.";
}
;
arcademics.ContentType.ANT_SYN_HOM = "ANT_SYN_HOM";
arcademics.ContentType.DIFFICULTY = "DIFFICULTY";
arcademics.ContentType.NONE = "NONE";
arcademics.ContentType.NUMERIC_RANGE = "NUMERIC_RANGE";
arcademics.ContentType.PARTS_OF_SPEECH = "PARTS_OF_SPEECH";
arcademics.ContentType.VERB_FORM = "VERB_FORM";
this.arcademics = this.arcademics || {};
arcademics.GameLauncher = function() {
    throw "GameLauncher cannot be instantiated.";
}
;
arcademics.GameLauncher.launch = function(a) {
    arcademics.Settings.init(a);
    a = arcademics[arcademics.Settings.lang.toUpperCase()];
    arcademics.Locale.loadLanguage(a);
    var b = new jk.Stage(arcademics.Settings.gameWidth,arcademics.Settings.gameHeight);
    arcademics.ScreenManager.init(b);
    if (1 < arcademics.Settings.numOfPlayers) {
        arcademics.Settings.multiClient.connect(arcademics.Settings.multiplayerURL);
        b = document.createElement("style");
        b.appendChild(document.createTextNode("@font-face {font-family: 'Montserrat';font-display: swap;src: url('" + baseURL + "/fonts/montserrat-cyrillic.woff2') format('woff2');unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;}"));
        b.appendChild(document.createTextNode("@font-face {font-family: 'Montserrat';font-display: swap;src: url('" + baseURL + "/fonts/montserrat-vietnamese.woff2') format('woff2');unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;}"));
        b.appendChild(document.createTextNode("@font-face {font-family: 'Montserrat';font-display: swap;src: url('" + baseURL + "/fonts/montserrat-latin.woff2') format('woff2');unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}"));
        document.head.appendChild(b);
        var c = document.createElement("div");
        c.style["font-family"] = "Montserrat";
        c.style.position = "absolute";
        c.style.visibility = "hidden";
        b = "";
        for (var d in a)
            b += a[d];
        c.appendChild(document.createTextNode(b));
        document.body.appendChild(c);
        setTimeout(function() {
            document.body.removeChild(c)
        }, 3E3)
    } else
        b = document.createElement("style"),
        b.appendChild(document.createTextNode("@font-face {font-family: 'Charm';font-display: swap;src: url('" + baseURL + "/fonts/charm.woff2') format('woff2');}")),
        document.head.appendChild(b);
    var e = new jk.Preloader;
    e.addEventListener(jk.Event.COMPLETE, function() {
        "Poki" == arcademics.Settings.affiliate && PokiSDK.gameLoadingFinished();
        var a = setInterval(function() {
            if (document.body.offsetWidth || document.body.offsetHeight || document.body.getClientRects().length)
                if (clearInterval(a),
                arcademics.Settings.quickStart)
                    if (1 < arcademics.Settings.numOfPlayers) {
                        var b = new arcademics.QuickStart;
                        b.addEventListener(jk.Event.COMPLETE, function(a) {
                            arcademics.ScreenManager.show(arcademics.GameplayScreen)
                        });
                        b.start()
                    } else
                        arcademics.ScreenManager.show(arcademics.SPGameplayScreen);
                else
                    arcademics.ScreenManager.show(arcademics.IntroScreen)
        }, 100)
    });
    "Poki" == arcademics.Settings.affiliate ? (PokiSDK = window.parent.PokiSDK,
    PokiSDK.init().then(function() {
        PokiSDK.gameLoadingStart();
        e.loadManifest(arcademics.Settings.preloaderManifest)
    }).catch(function() {
        console.log("PokiSDK Adblock enabled");
        PokiSDK.gameLoadingStart();
        e.loadManifest(arcademics.Settings.preloaderManifest)
    })) : e.loadManifest(arcademics.Settings.preloaderManifest)
}
;
this.arcademics = this.arcademics || {};
arcademics.GameType = function() {
    throw "GameType cannot be instantiated.";
}
;
arcademics.GameType.FFA = "FFA";
arcademics.GameType.SINGLE = "SINGLE";
arcademics.GameType.TEAM2 = "TEAM2";
arcademics.GameType.TEAM4 = "TEAM4";
this.arcademics = this.arcademics || {};
arcademics.GenericEvent = function(a, b, c) {
    jk.Event.call(this, a, b);
    this.params = c
}
;
$jscomp.inherits(arcademics.GenericEvent, jk.Event);
arcademics.GenericEvent.TIMER_COMPLETE = jk.Event.TIMER_COMPLETE;
arcademics.GenericEvent.TIMER = jk.Event.TIMER;
arcademics.GenericEvent.TICK = jk.Event.TICK;
arcademics.GenericEvent.REMOVED_FROM_STAGE = jk.Event.REMOVED_FROM_STAGE;
arcademics.GenericEvent.MOTION_CHANGE = jk.Event.MOTION_CHANGE;
arcademics.GenericEvent.INPUT = jk.Event.INPUT;
arcademics.GenericEvent.FILE_LOAD = jk.Event.FILE_LOAD;
arcademics.GenericEvent.FOCUS = jk.Event.FOCUS;
arcademics.GenericEvent.ENTER_FRAME = jk.Event.ENTER_FRAME;
arcademics.GenericEvent.COMPLETE = jk.Event.COMPLETE;
arcademics.GenericEvent.CHANGE = jk.Event.CHANGE;
arcademics.GenericEvent.BLUR = jk.Event.BLUR;
arcademics.GenericEvent.ADDED_TO_STAGE = jk.Event.ADDED_TO_STAGE;
arcademics.GenericEvent.ANIMATION_COMPLETE = "animationComplete";
arcademics.GenericEvent.ANSWER = "answer";
arcademics.GenericEvent.BOOSTER = "booster";
arcademics.GenericEvent.CHECK = "check";
arcademics.GenericEvent.CLOSE = "close";
arcademics.GenericEvent.CREATE_GAME = "createGame";
arcademics.GenericEvent.ITEM_CLICK = "itemClick";
arcademics.GenericEvent.JOIN_GAME = "joinGame";
arcademics.GenericEvent.LIGHTNING = "lightning";
arcademics.GenericEvent.MOVE = "move";
arcademics.GenericEvent.NEXT = "next";
arcademics.GenericEvent.OK = "ok";
arcademics.GenericEvent.PLAY_GAME = "playGame";
arcademics.GenericEvent.PLAY_NOW = "playNow";
arcademics.GenericEvent.REACH_BALL = "reachBall";
arcademics.GenericEvent.REMOVE_BALL = "removeBall";
arcademics.GenericEvent.SELECT_COLOR = "selectColor";
arcademics.GenericEvent.SELECT_LETTER = "selectLetter";
arcademics.GenericEvent.SELECT_SUBJECT = "selectSubject";
arcademics.GenericEvent.SKIP_QUESTION = "skipQuestion";
arcademics.GenericEvent.VIEW_VIDEO = "viewVideo";
this.arcademics = this.arcademics || {};
arcademics.QuestionType = function() {
    throw "QuestionType cannot be instantiated.";
}
;
arcademics.QuestionType.ALGEBRA = "ALGEBRA";
arcademics.QuestionType.ANSWER_ONLY = "ANSWER_ONLY";
arcademics.QuestionType.ARITHMETIC = "ARITHMETIC";
arcademics.QuestionType.CAPITAL = "CAPITAL";
arcademics.QuestionType.COMPARISON = "COMPARISON";
arcademics.QuestionType.MATCHING = "MATCHING";
arcademics.QuestionType.NORMAL = "NORMAL";
arcademics.QuestionType.QUESTION_ONLY = "QUESTION_ONLY";
arcademics.QuestionType.ROUNDING = "ROUNDING";
arcademics.QuestionType.ANT_SYN_HOM = "ANT_SYN_HOM";
arcademics.QuestionType.FILL_IN = "FILL_IN";
arcademics.QuestionType.PARTS_OF_SPEECH = "PARTS_OF_SPEECH";
arcademics.QuestionType.STRIKED_NOT_STRIKED = "STRIKED_NOT_STRIKED";
this.arcademics = this.arcademics || {};
arcademics.QuickStart = function() {
    jk.EventDispatcher.call(this);
    this.multiClient = arcademics.Settings.multiClient;
    this.numOfPlayers = arcademics.Settings.numOfPlayers;
    this.colors = arcademics.ColorPicker.defaultColors;
    this.multiClient.addEventListener(arcademics.MultiClientEvent.CREATE_ROOM, this.multiClient_createRoom.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.LOGIN, this.multiClient_login.bind(this))
}
;
$jscomp.inherits(arcademics.QuickStart, jk.EventDispatcher);
arcademics.QuickStart.prototype.start = function() {
    this.multiClient.connected ? (console.log("logging in"),
    this.multiClient.login("Test" + arcademics.RandomUtility.randomInteger(1, 999), "test")) : this.multiClient.addEventListener(arcademics.MultiClientEvent.CONNECT, this.start.bind(this))
}
;
arcademics.QuickStart.prototype.multiClient_createRoom = function(a) {
    console.log("created room: " + a.params.success);
    var b = arcademics.RandomUtility.randomInteger(0, 16);
    if (a.params.success) {
        this.multiClient.updateRoom(!1);
        console.log("setting up players");
        a = this.multiClient.myRoom.users;
        for (var c = [], d = 0; d < this.numOfPlayers; d++) {
            var e = a[d]
              , f = {};
            e ? (f.name = e.name,
            f.type = "human") : (f.name = arcademics.Locale.loadString("COMPUTER_PREFIX") + " " + (d + 1),
            f.type = "computer");
            switch (arcademics.Settings.gameType) {
            case arcademics.GameType.TEAM2:
                f.team = (b + d) % 2;
                break;
            case arcademics.GameType.TEAM4:
                f.team = (b + d) % 4
            }
            f.color = this.colors[d % this.colors.length];
            c.push(f)
        }
        arcademics.Settings.myPlayer = c[0];
        arcademics.Settings.playerId = 0;
        arcademics.Settings.players = c;
        arcademics.Settings.startMessage = arcademics.Settings.gameplayClass.generateStartMessage();
        this.multiClient.removeAllEventListeners();
        this.dispatchEvent(new jk.Event(jk.Event.COMPLETE))
    }
}
;
arcademics.QuickStart.prototype.multiClient_login = function(a) {
    console.log("logged in: " + a.params.success);
    a.params.success && (console.log("creating room"),
    this.multiClient.createRoom(this.multiClient.myUser.name + arcademics.Locale.loadString("GAME_NAME_SUFFIX"), "", this.numOfPlayers))
}
;
this.arcademics = this.arcademics || {};
arcademics.ScoreType = function() {
    throw "ScoreType cannot be instantiated.";
}
;
arcademics.ScoreType.SCORE = "SCORE";
arcademics.ScoreType.TIME = "TIME";
this.arcademics = this.arcademics || {};
arcademics.Settings = function() {
    throw "Settings cannot be instantiated.";
}
;
arcademics.Settings.init = function(a) {
    function b(a) {
        return a.replace(/(^[A-Z])/, function(a) {
            return $jscomp.makeIterator(a).next().value.toLowerCase()
        }).replace(/([A-Z])/g, function(a) {
            return "-" + $jscomp.makeIterator(a).next().value.toLowerCase()
        })
    }
    this.POINTS_CAPACITY = 100;
    this.POINTS_BOOSTER = 50;
    this.POINTS_LIGHTNING = 100;
    this.gameId;
    this.gameTitle;
    this.gamePrefix;
    this.copyrightTextColor;
    this.backgroundTextColor;
    this.numOfPlayers;
    this.titleClass;
    this.playerIconClass;
    this.redPlayerIconClass;
    this.bluePlayerIconClass;
    this.gameClass;
    this.gameType;
    this.scoreType;
    this.questionType;
    this.contentType;
    this.hostname = window.parent.document.location.hostname;
    this.pathname = window.parent.document.location.pathname;
    this.userId;
    this.assignmentId;
    this.content;
    this.contentHTML = !1;
    this.contentVoice = "usenglishmale";
    this.ribbon;
    this.powerUpPoints = this.starLevel = 0;
    this.lang = "en";
    this.playerName;
    this.endGameEnabled = this.printEnabled = this.playerNameEditable = !0;
    this.introDuration = 3E3;
    this.introURL;
    this.showCopyright = !0;
    this.copyrightURL = "https://www.arcademics.com";
    this.connectErrorURL = "https://www.arcademics.com/faq";
    this.saveDataURL = "https://plus.arcademics.com/api/save_data";
    this.savePartialDataURL = "https://plus.arcademics.com/api/save_partial_data";
    this.usePowerUpURL = "https://plus.arcademics.com/api/use_power_up";
    this.endGameURL = "https://www.arcademics.com";
    this.quickStart = this.debug = !1;
    this.isAffiliate = this.hostname && !this.hostname.endsWith("arcademics.com") || this.pathname.startsWith("/ideas/affiliates/");
    this.affiliate;
    this.roomId;
    this.zoneId;
    this.gameplayStartCallback = function() {}
    ;
    this.gameplayStopCallback = function() {}
    ;
    this.configured = {};
    var c = "userId gameId assignmentId content contentHTML contentVoice ribbon starLevel powerUpPoints lang playerName playerNameEditable printEnabled endGameEnabled introDuration introURL showCopyright connectErrorURL saveDataURL savePartialDataURL usePowerUpURL endGameURL debug quickStart isAffiliate affiliate roomId zoneId gameplayStartCallback gameplayStopCallback".split(" "), d;
    for (d in a)
        -1 < c.indexOf(d) && (this[d] = a[d],
        this.configured[d] = !0);
    void 0 == this.zoneId && void 0 != this.roomId && (this.zoneId = this.roomId);
    this.starLevel = Math.max(0, Math.min(this.starLevel, 4));
    this.powerUpPoints = Math.max(0, Math.min(this.powerUpPoints, this.POINTS_CAPACITY));
    !this.isAffiliate && this.content && 4 > this.content.length && (this.content = void 0);
    this.gameWidth = 1 == this.numOfPlayers ? 550 : 700;
    this.gameHeight = 400;
    this.backgroundId = this.gamePrefix + "Background";
    this.titleId = this.gamePrefix + "Title";
    this.instructionsId = this.gamePrefix + "Instructions";
    this.trophyId = this.gamePrefix + "Trophy";
    this.titleTextId = this.gamePrefix + "TitleText";
    this.gameplayBackgroundId = this.gamePrefix + "GameplayBackground";
    this.titleClass = arcademics[this.gamePrefix + "Title"];
    this.gameplayClass = arcademics[this.gamePrefix + "Game"];
    this.boxBackgroundColor = "#000000";
    this.boxBackgroundAlpha = .5;
    this.boxBorderRadius = 5;
    this.boxTextColor = "#FFFFFF";
    this.powerUpEnabled = !this.isAffiliate && 3 <= this.starLevel;
    "DiscoveryEd" != this.affiliate && (this.gaTracker = new arcademics.GATracker("UA-3270428-6"));
    this.service = new arcademics.Service(this.userId,this.gameId,this.assignmentId,this.debug);
    1 == this.numOfPlayers && (this.lastStatus = null,
    this.numOfStages = 6,
    this.soundOn = !0,
    this.stage = 0);
    1 < this.numOfPlayers && (this.multiplayerURL = "wss://multiplayer.arcademics.com",
    this.zonePrefix = "",
    this.zoneSuffix = "20140210",
    this.affiliate in {
        DiscoveryEd: null,
        MonsWorld: null,
        Time4Learning: null,
        Together: null
    } ? (this.multiplayerURL += "/" + this.affiliate.toLowerCase(),
    this.zonePrefix = this.affiliate,
    this.multiplayerURL += "/" + b(this.gamePrefix),
    void 0 != this.zoneId && (this.multiplayerURL += "/" + this.zoneId,
    this.zoneSuffix = this.zoneId)) : this.multiplayerURL += "/" + b(this.gamePrefix),
    this.playerIconId = this.gamePrefix + "PlayerIcon",
    this.playerIconRedId = this.gamePrefix + "PlayerIconRed",
    this.playerIconBlueId = this.gamePrefix + "PlayerIconBlue",
    this.zoneName = this.zonePrefix + " " + this.gameTitle + " " + this.zoneSuffix,
    this.multiClient = new arcademics.MultiClient(this.debug),
    this.myPlayer = null,
    this.playerId = NaN,
    this.pointsDiff = this.badgesDiff = this.winningTeam = this.lastGameInstance = this.startMessage = this.players = null);
    707466 == this.gameId && 1001 <= this.assignmentId && 1E4 >= this.assignmentId && (this.titleId = "ArcademicsCupTitle")
}
;
arcademics.Settings.reset = function() {}
;
arcademics.Settings.getOption = function(a, b) {
    return void 0 !== this[a] ? this[a] : void 0 === b ? null : b
}
;
arcademics.Settings.requireOption = function(a) {
    if (void 0 !== this[a])
        return this[a];
    throw "The option '" + a + "' was required but not set.";
}
;
arcademics.Settings.setOption = function(a, b) {
    this[a] = b
}
;
arcademics.Settings.setOptionIfUnset = function(a, b) {
    void 0 === this[a] && (this[a] = b)
}
;
this.arcademics = this.arcademics || {};
arcademics.GATracker = function(a) {
    for (var b = this, c = !1, d = window.parent.document.getElementsByTagName("script"), e = 0; e < d.length; e++) {
        var f = d[e];
        "https://www.google-analytics.com/analytics.js" == f.src && (c = !0)
    }
    c || (f = window.parent.document.createElement("script"),
    f.async = !0,
    f.src = "https://www.google-analytics.com/analytics.js",
    window.parent.document.head.appendChild(f));
    window.parent.ga = window.parent.ga || function() {
        (window.parent.ga.q = window.parent.ga.q || []).push(arguments)
    }
    ;
    window.parent.ga.l = +new Date;
    window.parent.ga(function() {
        b.tracker = window.parent.ga.create(a, "auto", a)
    })
}
;
arcademics.GATracker.prototype.trackGameplay = function(a, b) {
    var c = this;
    window.parent.ga(function() {
        c.tracker.send("event", {
            eventCategory: "Games",
            eventAction: "Play",
            eventLabel: a,
            eventValue: b
        })
    })
}
;
arcademics.GATracker.prototype.trackMultiplayerError = function(a) {
    var b = this;
    window.parent.ga(function() {
        b.tracker.send("event", {
            eventCategory: "Games",
            eventAction: "Multiplayer Error",
            eventLabel: a
        })
    })
}
;
this.arcademics = this.arcademics || {};
arcademics.Service = function(a, b, c, d) {
    this.userId = a;
    this.gameId = b;
    this.assignmentId = c;
    this.debug = d
}
;
arcademics.Service.prototype.saveData = function(a) {
    var b = this;
    if (void 0 != this.userId || !isNaN(a.score))
        if (void 0 != this.assignmentId || !arcademics.Settings.content)
            if (!arcademics.Settings.isAffiliate || arcademics.Settings.configured.saveDataURL) {
                var c = {};
                c.game_id = this.gameId;
                c.player_name = a.playerName;
                c.score = a.score;
                if (void 0 != this.userId) {
                    c.user_id = this.userId;
                    c.assignment_id = this.assignmentId;
                    c.hits = a.hits;
                    c.misses = a.misses;
                    c.time = a.time;
                    c.responses = [];
                    for (var d = 0; d < a.responses.length; d++) {
                        var e = a.responses[d]
                          , f = {};
                        f.question = String(e.question);
                        f.correct = e.correct ? 1 : 0;
                        f.time = e.time;
                        c.responses.push(f)
                    }
                    c.stage = a.stage;
                    c.passed = a.passed;
                    c.place = a.place;
                    c.hitsOffset = a.hitsOffset;
                    c.missesOffset = a.missesOffset;
                    c.timeOffset = a.timeOffset
                }
                arcademics.Settings.badgesDiff = void 0;
                arcademics.Settings.pointsDiff = void 0;
                if ("test" == arcademics.Settings.affiliate)
                    window.parent.displayData(c);
                else
                    var g = this._sendRequest(arcademics.Settings.saveDataURL, c, function() {
                        b.debug && console.log(g.response);
                        if (!arcademics.Settings.isAffiliate && ("ribbon"in g.response && (arcademics.Settings.ribbon = g.response.ribbon),
                        "star_level"in g.response && (arcademics.Settings.starLevel = g.response.star_level),
                        "points_power_up"in g.response && (arcademics.Settings.powerUpPoints = g.response.points_power_up),
                        "badges_diff"in g.response && (arcademics.Settings.badgesDiff = g.response.badges_diff),
                        "points_diff"in g.response && (arcademics.Settings.pointsDiff = g.response.points_diff),
                        window.parent.updatePage && (window.parent.updatePage(g.response),
                        void 0 != b.userId && 2 < g.response.top_scores.length && (a.score == g.response.top_scores[0].score || a.score == g.response.top_scores[1].score) && 707466 == arcademics.Settings.gameId && .8 > a.score / g.response.top_scores[2].score))) {
                            var c = new XMLHttpRequest;
                            c.open("POST", "https://arcademics-logs.appspot.com/games-html5/top-scores", !0);
                            c.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            var d = {};
                            d.game_id = b.gameId;
                            d.player_name = a.playerName;
                            d.score = a.score;
                            d.hits = a.hits;
                            d.misses = a.misses;
                            d.time = a.time;
                            d.responses = [];
                            for (var e = 0; e < a.responses.length; e++) {
                                var f = a.responses[e]
                                  , n = {};
                                n.question = String(f.question);
                                n.correct = f.correct ? 1 : 0;
                                n.time = f.time;
                                d.responses.push(n)
                            }
                            c.send("level=10&msg=" + encodeURIComponent(JSON.stringify(d)))
                        }
                    })
            }
}
;
arcademics.Service.prototype.savePartialData = function(a, b) {
    var c = this
      , d = {};
    d.user_id = this.userId;
    d.gora_id = this.assignmentId;
    d.hits = a;
    d.misses = b;
    var e = this._sendRequest(arcademics.Settings.savePartialDataURL, d, function() {
        c.debug && console.log(e.response)
    })
}
;
arcademics.Service.prototype.usePowerUp = function(a) {
    var b = this
      , c = {};
    c.user_id = this.userId;
    c.game_id = this.gameId;
    c.assignment_id = this.assignmentId;
    c.power_up_type = a;
    var d = this._sendRequest(arcademics.Settings.usePowerUpURL, c, function() {
        b.debug && console.log(d.response)
    })
}
;
arcademics.Service.prototype._hashCode = function(a) {
    for (var b = 0, c = 0; c < a.length; c++) {
        var d = a.charCodeAt(c);
        b = (b << 5) - b + d;
        b &= b
    }
    return b
}
;
arcademics.Service.prototype._sendRequest = function(a, b, c) {
    for (var d in b)
        "number" == typeof b[d] && isNaN(b[d]) ? delete b[d] : null == b[d] && delete b[d];
    b = JSON.stringify(b);
    d = new XMLHttpRequest;
    d.open("POST", a, !0);
    d.setRequestHeader("Accept", "application/json;q=0." + this._hashCode(b) % 1E3);
    d.responseType = "json";
    d.onload = c;
    d.onerror = function() {
        console.error("Error requesting " + a)
    }
    ;
    d.send(b);
    this.debug && console.log(b);
    return d
}
;
this.arcademics = this.arcademics || {};
arcademics.AnswerButton = function() {
    jk.Container.call(this);
    this._height = 42;
    this._width = 56;
    this.cursor = "pointer";
    var a = new jk.Rect(0,0,this._width,this._height,2,2,{
        "stroke-width": 2
    });
    this.backgroundBox = this.addChild(a);
    a = new jk.Text;
    a.ariaHidden = !0;
    a.fontFamily = "Arial";
    a.fontSize = 10;
    a.fontWeight = "bold";
    a.pointerEvents = "none";
    a.x = 3;
    this.answerNumField = this.addChild(a);
    a = new jk.Text;
    a.color = "#FFFFFF";
    a.fontFamily = "Arial";
    a.fontSize = this._height - 10;
    a.pointerEvents = "none";
    a.textAlign = "center";
    a.x = this._width / 2;
    a.y = 2;
    this.answerField = this.addChild(a);
    this.color = "#000000"
}
;
$jscomp.inherits(arcademics.AnswerButton, jk.Container);
arcademics.AnswerButton.getUID = jk.Container.getUID;
arcademics.AnswerButton._nextUID = jk.Container._nextUID;
$jscomp.global.Object.defineProperties(arcademics.AnswerButton.prototype, {
    answer: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.answerField.text
        },
        set: function(a) {
            this.answerField.fontSize = this._height - 12;
            this.answerField.text = a;
            this.answerField.visible = !0;
            for (this.answerField.y = 2; this.answerField.width + 4 > this._width - 4 && 12 < this.answerField.fontSize; )
                this.answerField.fontSize -= 2,
                this.answerField.y += 1
        }
    },
    answerNum: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.answerNumField.text = a + "."
        }
    },
    answerVisible: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.answerField.visible = a
        }
    },
    color: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            for (var b = ["#000000", "#333333"], c = [0, .25], d = [], e = 0; e < b.length; e++)
                d.push(arcademics.ColorUtility.blendColorsByPercent(b[e], a, c[e]));
            a = arcademics.ColorUtility.blendColorsByPercent(a, 0, .5);
            this.backgroundBox.setAttributes({
                fill: new jk.Gradient(jk.Gradient.LINEAR,d,[1, 1],[0, 1],90)
            });
            this.answerNumField.color = a
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this.backgroundBox.height = a
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this.backgroundBox.width = a;
            this.answerField.x = this._width / 2
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.ContentItem = function(a, b, c) {
    this.question = a;
    this.correctAnswer = b;
    this.wrongAnswers = c;
    this.answers = [b].concat(c)
}
;
arcademics.ContentItem.prototype.shuffle = function() {
    if (this.wrongAnswers) {
        var a = arcademics.RandomUtility.shuffle(this.wrongAnswers).slice(0, 3);
        this.answers = arcademics.RandomUtility.shuffle([this.correctAnswer].concat(a))
    }
}
;
arcademics.ContentItem.prototype.toArray = function() {
    return [this.question, this.correctAnswer, this.wrongAnswers]
}
;
this.arcademics = this.arcademics || {};
arcademics.ContentManager = function(a, b) {
    this._contentItems = a.concat();
    this._contentItems0 = a.concat();
    this._index = -1;
    this._shuffleType = b
}
;
arcademics.ContentManager.prototype.nextItem = function() {
    this._index++;
    0 == this._index % this._contentItems.length && 0 != this._index && this.shuffle();
    var a = this._contentItems[this._index % this._contentItems.length];
    a.shuffle && a.shuffle();
    return a
}
;
arcademics.ContentManager.prototype.parseArray = function(a) {
    this._contentItems = [];
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        c = Array.isArray(c) ? new arcademics.ContentItem(c[0],c[1],c[2]) : "string" == typeof c ? new arcademics.ContentItem(c,c,[]) : new arcademics.ContentItem(c.q,c.ca,c.wa);
        this._contentItems.push(c)
    }
    this._contentItems0 = this._contentItems.concat();
    this._index = -1
}
;
arcademics.ContentManager.prototype.reset = function() {
    this._index = -1
}
;
arcademics.ContentManager.prototype.shuffle = function() {
    this._shuffleType == arcademics.ContentManager.SHUFFLE ? this._contentItems = arcademics.RandomUtility.shuffle(this._contentItems) : this._shuffleType == arcademics.ContentManager.PARTIAL_SHUFFLE && (this._contentItems = arcademics.RandomUtility.partialShuffle(this._contentItems, this._contentItems.length))
}
;
arcademics.ContentManager.prototype.select = function(a, b, c) {
    isNaN(a) && (a = 0);
    isNaN(b) && (b = 0);
    if (0 > a || 1 < a || 0 > b || 1 < b || a > b)
        console.log("Invalid range for ContentManager.select");
    else {
        a = Math.floor(a * this._contentItems0.length);
        b = Math.ceil(b * this._contentItems0.length) - a;
        if (isNaN(c) || c > b)
            c = b;
        var d = this._contentItems0;
        this._shuffleType == arcademics.ContentManager.SHUFFLE ? d = arcademics.RandomUtility.shuffle(this._contentItems0) : this._shuffleType == arcademics.ContentManager.PARTIAL_SHUFFLE && (d = arcademics.RandomUtility.partialShuffle(this._contentItems0, this._contentItems0.length));
        this._contentItems = [];
        for (var e = 0; e < c; e++)
            this._contentItems.push(d[Math.round(e * b / c) + a]);
        this._index = -1
    }
}
;
arcademics.ContentManager.prototype.toArray = function() {
    for (var a = [], b = 0; b < this._contentItems.length; b++)
        a.push(this._contentItems[b].toArray());
    return a
}
;
$jscomp.global.Object.defineProperties(arcademics.ContentManager.prototype, {
    index: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._index
        }
    },
    item: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._contentItems[this._index % this._contentItems.length]
        }
    }
});
arcademics.ContentManager.NONE = "none";
arcademics.ContentManager.PARTIAL_SHUFFLE = "partial shuffle";
arcademics.ContentManager.SHUFFLE = "shuffle";
this.arcademics = this.arcademics || {};
arcademics.PlayerArea = function() {
    jk.Container.call(this);
    this.SPACING = 6;
    var a = new jk.Rect(0,0,0,0,{
        fill: "#FFFFFF",
        "fill-opacity": .5,
        stroke: "#000000",
        "stroke-opacity": .25
    });
    this.backgroundBox = this.addChild(a);
    a = new jk.SVG(arcademics.Settings.playerIconId);
    arcademics.DisplayUtility.fit(a, 12, 10, 80, 66, "center", "center");
    this.playerIconClip = this.addChild(a);
    var b = new jk.Text;
    b.color = "#333333";
    b.fontFamily = "Arial";
    b.fontSize = 10;
    b.textAlign = "center";
    b.width = 80;
    b.x = 50;
    b.y = a.y + a.height + 5;
    this.playerNameField = this.addChild(b);
    a = new (arcademics.Settings.getOption("questionAreaClass", arcademics.QuestionArea));
    a.x = 104;
    a.y = this.SPACING;
    this.questionArea = this.addChild(a);
    a = new arcademics.PowerUpSprite;
    a.visible = arcademics.Settings.powerUpEnabled;
    a.x = 368;
    a.y = 10;
    this.powerUpSprite = this.addChild(a);
    this.update()
}
;
$jscomp.inherits(arcademics.PlayerArea, jk.Container);
arcademics.PlayerArea.getUID = jk.Container.getUID;
arcademics.PlayerArea._nextUID = jk.Container._nextUID;
arcademics.PlayerArea.prototype.update = function() {
    var a = Math.max(this.questionArea.height, 84);
    arcademics.DisplayUtility.fit(this.playerIconClip, 12, 10, 80, a - 18, "center", "center");
    this.playerNameField.y = this.playerIconClip.y + this.playerIconClip.height + 5;
    arcademics.DisplayUtility.fit(this.powerUpSprite, this.questionArea.x + this.questionArea.width + 16, 10, 100, a, "center", "center");
    this.backgroundBox.height = this.questionArea.height + 2 * this.SPACING;
    this.backgroundBox.width = this.questionArea.width + 228
}
;
$jscomp.global.Object.defineProperties(arcademics.PlayerArea.prototype, {
    playerColor: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.playerIconClip.color = a;
            this.questionArea.color = a
        }
    },
    playerName: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.playerNameField.text = a
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.PowerUpSprite = function() {
    jk.Container.call(this);
    this._points = 0;
    this.disabledFilter = (new jk.ColorMatrixFilter).adjustContrast(-50);
    var a = new arcademics.Booster;
    a.filters = [this.disabledFilter];
    a.mouseEnabled = !1;
    a.addEventListener(jk.MouseEvent.CLICK, this.boosterClip_click.bind(this));
    arcademics.DisplayUtility.fit(a, 0, 0, 60, 60, "center", "center");
    this.boosterClip = this.addChild(a);
    a = new arcademics.PowerUpReady;
    a.x = 30;
    a.y = 30;
    this.boosterReadyClip = this.addChild(a);
    a = new arcademics.Lightning;
    a.filters = [this.disabledFilter];
    a.mouseEnabled = !1;
    a.addEventListener(jk.MouseEvent.CLICK, this.lightningClip_click.bind(this));
    arcademics.DisplayUtility.fit(a, 60, 0, 60, 60, "center", "center");
    this.lightningClip = this.addChild(a);
    a = new arcademics.PowerUpReady;
    a.x = 90;
    a.y = 30;
    this.lightningReadyClip = this.addChild(a);
    a = new jk.Rect(10,60,100,12,{
        fill: "#333333"
    });
    this.addChild(a);
    a = new jk.Rect(11,61,98 * this._points / arcademics.Settings.POINTS_CAPACITY,10,{
        fill: "#02D2BD"
    });
    this.boosterBarProgress = this.addChild(a);
    a = new jk.Path("M 60 60 V 72",{
        stroke: "#666666",
        "stroke-opacity": .5
    });
    this.addChild(a);
    this.glowFilter = new jk.GlowFilter("#FFFFFF",1,4,4,4);
    this.tween = (new jk.Tween(this.glowFilter,{
        loop: !0
    })).to({
        blurX: 10
    }, 1E3 / 30 * 60, jk.Ease.quadOut).to({
        blurX: 4
    }, 1E3 / 30 * 60, jk.Ease.quadIn);
    this.tween.addEventListener(jk.Event.MOTION_CHANGE, this.motionChange.bind(this));
    this.update();
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.PowerUpSprite, jk.Container);
arcademics.PowerUpSprite.getUID = jk.Container.getUID;
arcademics.PowerUpSprite._nextUID = jk.Container._nextUID;
arcademics.PowerUpSprite.prototype.booster = function() {
    var a = this;
    this.boosterClip.play();
    setTimeout(function() {
        a.boosterClip.stop();
        a._points < arcademics.Settings.POINTS_BOOSTER && (a.boosterClip.filters = [a.disabledFilter])
    }, arcademics.Settings.boosterDuration);
    this._points < arcademics.Settings.POINTS_LIGHTNING && (this.lightningClip.filters = [this.disabledFilter])
}
;
arcademics.PowerUpSprite.prototype.lightning = function() {
    var a = this;
    this.lightningClip.play();
    setTimeout(function() {
        a.lightningClip.stop();
        a._points < arcademics.Settings.POINTS_LIGHTNING && (a.lightningClip.filters = [a.disabledFilter])
    }, arcademics.Settings.lightningDuration);
    this._points < arcademics.Settings.POINTS_BOOSTER && (this.boosterClip.filters = [this.disabledFilter])
}
;
arcademics.PowerUpSprite.prototype.update = function() {
    this.boosterBarProgress.width = 98 * this._points / arcademics.Settings.POINTS_CAPACITY
}
;
arcademics.PowerUpSprite.prototype.boosterClip_click = function(a) {
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.BOOSTER))
}
;
arcademics.PowerUpSprite.prototype.lightningClip_click = function(a) {
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.LIGHTNING))
}
;
arcademics.PowerUpSprite.prototype.motionChange = function(a) {
    this.glowFilter.blurY = this.glowFilter.blurX;
    3 <= arcademics.Settings.starLevel && this._points >= arcademics.Settings.POINTS_BOOSTER && (this.boosterClip.filters = [this.glowFilter]);
    4 <= arcademics.Settings.starLevel && this._points >= arcademics.Settings.POINTS_LIGHTNING && (this.lightningClip.filters = [this.glowFilter])
}
;
$jscomp.global.Object.defineProperties(arcademics.PowerUpSprite.prototype, {
    points: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            var b = !1
              , c = !1;
            a = Math.max(0, Math.min(a, arcademics.Settings.POINTS_CAPACITY));
            3 <= arcademics.Settings.starLevel && (this._points < arcademics.Settings.POINTS_BOOSTER && a >= arcademics.Settings.POINTS_BOOSTER ? (b = !0,
            this.boosterClip.cursor = "pointer",
            this.boosterClip.filters = [],
            this.boosterClip.mouseEnabled = !0,
            this.boosterReadyClip.play()) : this._points >= arcademics.Settings.POINTS_BOOSTER && a < arcademics.Settings.POINTS_BOOSTER && (this.boosterClip.cursor = "default",
            this.boosterClip.filters = [],
            this.boosterClip.mouseEnabled = !1));
            4 <= arcademics.Settings.starLevel && (this._points < arcademics.Settings.POINTS_LIGHTNING && a >= arcademics.Settings.POINTS_LIGHTNING ? (c = !0,
            this.lightningClip.cursor = "pointer",
            this.lightningClip.filters = [],
            this.lightningClip.mouseEnabled = !0,
            this.lightningReadyClip.play()) : this._points >= arcademics.Settings.POINTS_LIGHTNING && a < arcademics.Settings.POINTS_LIGHTNING && (this.lightningClip.cursor = "default",
            this.lightningClip.filters = [],
            this.lightningClip.mouseEnabled = !1));
            (b || c) && jk.Sound.play("power_up_ready");
            this._points = a;
            this.update()
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.QuestionArea = function() {
    jk.Container.call(this);
    this.SPACING = 6;
    this._color = "#000000";
    this._height = 94;
    this._layout = "vertical";
    this._numAnswers = 4;
    this._ratioQA = 46 / 88;
    this._width = 248;
    this.answerButtons = [];
    var a = new arcademics.QuestionBox;
    arcademics.Settings.contentHTML && (a.questionClass = arcademics.HTML);
    this.questionBox = this.addChild(a);
    this.addAnswerButtons();
    this.update()
}
;
$jscomp.inherits(arcademics.QuestionArea, jk.Container);
arcademics.QuestionArea.getUID = jk.Container.getUID;
arcademics.QuestionArea._nextUID = jk.Container._nextUID;
arcademics.QuestionArea.prototype.showOnly = function(a) {
    for (var b = 0; b < this.answerButtons.length; b++)
        this.answerButtons[b].answerVisible = this.answerButtons[b].answer == a
}
;
arcademics.QuestionArea.prototype.addAnswerButtons = function() {
    this.answerButtons = [];
    for (var a = 0; a < this._numAnswers; a++) {
        var b = new arcademics.AnswerButton;
        b.answerNum = a + 1;
        b.addEventListener(jk.MouseEvent.CLICK, this.answerButton_click.bind(this));
        this.addChild(b);
        this.answerButtons.push(b)
    }
}
;
arcademics.QuestionArea.prototype.removeAnswerButtons = function() {
    for (var a = 0; a < this.answerButtons.length; a++)
        this.removeChild(this.answerButtons[a]);
    this.answerButtons = []
}
;
arcademics.QuestionArea.prototype.update = function() {
    this.questionBox.color = this._color;
    if ("vertical" == this._layout) {
        this.questionBox.height = (this._height - this.SPACING) * this._ratioQA;
        this.questionBox.width = this._width;
        for (var a = (this._width - (this._numAnswers - 1) * this.SPACING) / this._numAnswers, b = 0; b < this.answerButtons.length; b++) {
            var c = this.answerButtons[b];
            c.color = this._color;
            c.height = (this._height - this.SPACING) * (1 - this._ratioQA);
            c.width = a;
            c.x = (a + this.SPACING) * b;
            c.y = this.questionBox.height + this.SPACING
        }
    } else if ("horizontal" == this._layout)
        for (this.questionBox.height = this._height,
        this.questionBox.width = (this._width - this.SPACING) * this._ratioQA,
        a = (this.questionBox.height - (this._numAnswers - 1) * this.SPACING) / this._numAnswers,
        b = 0; b < this.answerButtons.length; b++)
            c = this.answerButtons[b],
            c.color = this._color,
            c.height = a,
            c.width = (this._width - this.SPACING) * (1 - this._ratioQA),
            c.x = this._width / 2 + this.SPACING,
            c.y = (a + this.SPACING) * b
}
;
arcademics.QuestionArea.prototype.answerButton_click = function(a) {
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.ANSWER,this,{
        answer: a.currentTarget.answer
    }))
}
;
$jscomp.global.Object.defineProperties(arcademics.QuestionArea.prototype, {
    answers: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            for (var a = [], b = 0; b < this.answerButtons.length; b++)
                a.push(this.answerButtons[b].answer);
            return a
        },
        set: function(a) {
            for (var b = 0; b < this.answerButtons.length; b++)
                this.answerButtons[b].answer = a[b]
        }
    },
    color: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._color = a;
            this.update()
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this.update()
        }
    },
    layout: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._layout = a
        }
    },
    numAnswers: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._numAnswers = a;
            this.removeAnswerButtons();
            this.addAnswerButtons();
            this.update()
        }
    },
    question: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.questionBox.question = a
        }
    },
    questionClass: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            arcademics.Settings.contentHTML || (this.questionBox.questionClass = a);
            this.update()
        }
    },
    questionNum: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.questionBox.questionNum = a
        }
    },
    ratioQA: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._ratioQA = a;
            this.update()
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this.update()
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.QuestionBox = function() {
    jk.Container.call(this);
    this._height = 46;
    this._questionClass = null;
    this._width = 248;
    var a = new jk.Rect(0,0,this._width,this._height,{
        fill: new jk.Gradient(jk.Gradient.RADIAL,["#333333", "#000000"],[1, 1],[0, 1]),
        "stroke-width": 2
    });
    this.backgroundBox = this.addChild(a);
    a = new jk.Text;
    a.color = "#999999";
    a.fontFamily = "Arial";
    a.fontSize = 8;
    a.fontWeight = "bold";
    a.text = arcademics.Locale.loadString("QUESTION");
    a.textAlign = "center";
    a.x = 25;
    a.y = 2;
    this.questionTextField = this.addChild(a);
    a = new jk.Text;
    a.color = "#666666";
    a.fontFamily = "Arial";
    a.fontSize = 28;
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 25;
    a.y = 6;
    this.questionNumField = this.addChild(a);
    this.addQuestionObject()
}
;
$jscomp.inherits(arcademics.QuestionBox, jk.Container);
arcademics.QuestionBox.getUID = jk.Container.getUID;
arcademics.QuestionBox._nextUID = jk.Container._nextUID;
arcademics.QuestionBox.prototype.addQuestionObject = function() {
    if (this._questionClass) {
        var a = new this._questionClass;
        a.x = 0;
        a.y = 0;
        this.questionClip = this.addChild(a)
    } else
        a = new jk.Text,
        a.ariaLive = "assertive",
        a.color = "#FFFFFF",
        a.fontFamily = "Arial",
        a.fontSize = this._height - 10,
        a.textAlign = "center",
        a.x = 60 + (this._width - 120) / 2,
        a.y = 0,
        this.questionField = this.addChild(a)
}
;
arcademics.QuestionBox.prototype.removeQuestionObject = function() {
    this.questionClip && (this.removeChild(this.questionClip),
    this.questionClip = void 0);
    this.questionField && (this.removeChild(this.questionField),
    this.questionField = void 0)
}
;
$jscomp.global.Object.defineProperties(arcademics.QuestionBox.prototype, {
    color: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.backgroundBox.setAttributes({
                stroke: a
            });
            this.questionClip && (this.questionClip.color = a)
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this.backgroundBox.height = a
        }
    },
    question: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.questionClip && this.questionClip.display(a);
            if (this.questionField)
                for ("ar" == arcademics.Settings.lang && (this.questionField.direction = "rtl"),
                this.questionField.fontSize = this._height - 12,
                this.questionField.text = a,
                this.questionField.textAlign = "center",
                this.questionField.x = 60 + (this._width - 120) / 2,
                this.questionField.y = 0,
                this.questionField.width > this._width - 128 && (this.questionField.textAlign = "left",
                this.questionField.x = 60); this.questionField.width > this._width - 74 && 12 < this.questionField.fontSize; )
                    this.questionField.fontSize -= 2,
                    this.questionField.y += 1
        }
    },
    questionClass: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._questionClass = a;
            this.removeQuestionObject();
            this.addQuestionObject()
        }
    },
    questionNum: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.questionNumField.text = String(a)
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this.backgroundBox.width = a;
            this.questionClip && (this.questionClip.x = a / 2 - this.questionClip.width / 2)
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.HTML = function() {
    jk.Container.call(this);
    var a = new jk.ForeignObject;
    a.color = "#FFFFFF";
    a.fontFamily = "Arial";
    a.fontSize = 18;
    a.textAlign = "center";
    this.foreignObject = this.addChild(a)
}
;
$jscomp.inherits(arcademics.HTML, jk.Container);
arcademics.HTML.getUID = jk.Container.getUID;
arcademics.HTML._nextUID = jk.Container._nextUID;
arcademics.HTML.prototype.display = function(a) {
    this.foreignObject.innerHTML = a
}
;
$jscomp.global.Object.defineProperties(arcademics.HTML.prototype, {
    color: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {}
    }
});
this.arcademics = this.arcademics || {};
arcademics.SubtractionGenerator = function() {
    throw "SubtractionGenerator cannot be instantiated.";
}
;
arcademics.SubtractionGenerator.generateItems = function(a, b) {
    var c = [];
    if (a > b) {
        var d = a;
        a = b;
        b = d
    }
    b = b - a + 1;
    for (d = 0; d < b; d++)
        for (var e = 0; e < d + 1; e++) {
            var f = e + a
              , g = d - e + a;
            f > g && c.push(this._generateItem(f, g))
        }
    for (d = 1; d < b; d++)
        for (e = 0; e < b - d; e++)
            f = d + e + a,
            g = b - e - 1 + a,
            f > g && c.push(this._generateItem(f, g));
    return c
}
;
arcademics.SubtractionGenerator._generateItem = function(a, b) {
    var c = a + "-" + b
      , d = a - b
      , e = [a - b + 1, a - b - 1, a - b + 2, a - b - 2, a - b + 3];
    e = arcademics.RandomUtility.shuffle(e);
    for (var f = [], g = 0; g < e.length; g++) {
        var h = e[g];
        if (h != d && -1 == f.indexOf(h) && (0 > a || 0 > b || 0 < h) && (f.push(h),
        3 == f.length))
            break
    }
    return new arcademics.ContentItem(c,d,f)
}
;
this.arcademics = this.arcademics || {};
arcademics.Button = function(a) {
    jk.Container.call(this);
    this._enabled = !0;
    this._labelOffsetX = this._labelAdjustWidth = 0;
    this.cursor = "pointer";
    this.role = "button";
    this.disabledFilter = new jk.ColorMatrixFilter(.5,.5,.5);
    this.hoverFilter = new jk.ColorMatrixFilter(1.1,1.1,1.1);
    a = new jk.SVG(a);
    this._backgroundClip = this.addChild(a);
    var b = new jk.Text;
    b.color = "#FFFFFF";
    b.fontSize = 14;
    b.textAlign = "center";
    b.width = a.width + this._labelAdjustWidth;
    b.x = a.width / 2 + this._labelOffsetX;
    this._labelField = this.addChild(b);
    this.addEventListener(jk.MouseEvent.MOUSE_DOWN, this._mouseDown.bind(this));
    this.addEventListener(jk.MouseEvent.MOUSE_ENTER, this._mouseEnter.bind(this));
    this.addEventListener(jk.MouseEvent.MOUSE_LEAVE, this._mouseLeave.bind(this));
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.Button, jk.Container);
arcademics.Button.getUID = jk.Container.getUID;
arcademics.Button._nextUID = jk.Container._nextUID;
arcademics.Button.prototype._mouseDown = function(a) {
    this._enabled && (this.filters = [])
}
;
arcademics.Button.prototype._mouseEnter = function(a) {
    this._enabled && (this.filters = [this.hoverFilter])
}
;
arcademics.Button.prototype._mouseLeave = function(a) {
    this._enabled && (this.filters = [])
}
;
arcademics.Button.prototype._update = function() {
    this._labelField.width = this._backgroundClip.width + this._labelAdjustWidth;
    this._labelField.x = this._backgroundClip.width / 2 + this._labelOffsetX;
    this._labelField.y = this._backgroundClip.height / 2 - this._labelField.height / 1.75
}
;
$jscomp.global.Object.defineProperties(arcademics.Button.prototype, {
    enabled: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._enabled
        },
        set: function(a) {
            (this._mouseEnabled = this._enabled = a) ? (this.ariaDisabled = !1,
            this.cursor = "pointer",
            this.filters = []) : (this.ariaDisabled = !0,
            this.cursor = "default",
            this.filters = [this.disabledFilter])
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this._backgroundClip.height = a;
            this._update()
        }
    },
    label: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._labelField.text
        },
        set: function(a) {
            this._labelField.text = a;
            this._update()
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this._backgroundClip.width = a;
            this._update()
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.ColorPicker = function(a, b) {
    jk.Container.call(this);
    this.colorSwatches = [];
    this.selectedColorSwatch = void 0;
    var c = 390 / (5 * (arcademics.ColorPicker.defaultColors.length + 1) + 1)
      , d = 5 * c
      , e = 4 * c
      , f = new jk.Rect(0,0,390,a ? 270 : 90,{
        fill: "#333333",
        stroke: "#000000",
        "stroke-width": 4
    });
    this.addChild(f);
    f = new jk.SVG("PaintBrushClip");
    arcademics.DisplayUtility.fit(f, c + 1 * e / 8, 22.5, 3 * e / 4, 45, "center", "center");
    this.addChild(f);
    for (f = 0; f < arcademics.ColorPicker.defaultColors.length; f++) {
        var g = new arcademics.ColorSwatch;
        g.color = arcademics.ColorPicker.defaultColors[f];
        g.cursor = "pointer";
        g.height = 60;
        g.width = e;
        g.x = (f + 1) * d + c;
        g.y = 15;
        g.addEventListener(jk.MouseEvent.CLICK, this.colorSwatch_click.bind(this));
        this.addChild(g);
        this.colorSwatches.push(g)
    }
    if (a) {
        a = new jk.Path("M 0 90 H 390",{
            stroke: "#000000",
            "stroke-width": 2
        });
        this.addChild(a);
        a = new jk.SVG("StarClip");
        arcademics.DisplayUtility.fit(a, c + e / 4, 120, e / 2, 30, "center", "center");
        this.addChild(a);
        for (f = 0; f < arcademics.ColorPicker.oneStarColors.length; f++)
            g = new arcademics.ColorSwatch,
            g.color = arcademics.ColorPicker.oneStarColors[f],
            g.height = 60,
            g.width = e,
            g.x = (f + 1) * d + c,
            g.y = 105,
            1 <= b ? (g.cursor = "pointer",
            g.addEventListener(jk.MouseEvent.CLICK, this.colorSwatch_click.bind(this))) : g.locked = !0,
            this.addChild(g),
            this.colorSwatches.push(g);
        a = new jk.Path("M 0 180 H 390",{
            stroke: "#000000",
            "stroke-width": 2
        });
        this.addChild(a);
        a = new jk.SVG("StarClip");
        arcademics.DisplayUtility.fit(a, c, 210, e / 2, 30, "center", "center");
        this.addChild(a);
        a = new jk.SVG("StarClip");
        arcademics.DisplayUtility.fit(a, c + e / 2, 210, e / 2, 30, "center", "center");
        this.addChild(a);
        for (f = 0; f < arcademics.ColorPicker.twoStarColors.length; f++)
            g = new arcademics.ColorSwatch,
            g.color = arcademics.ColorPicker.twoStarColors[f],
            g.height = 60,
            g.width = e,
            g.x = (f + 1) * d + c,
            g.y = 195,
            2 <= b ? (g.cursor = "pointer",
            g.addEventListener(jk.MouseEvent.CLICK, this.colorSwatch_click.bind(this))) : g.locked = !0,
            this.addChild(g),
            this.colorSwatches.push(g)
    }
}
;
$jscomp.inherits(arcademics.ColorPicker, jk.Container);
arcademics.ColorPicker.getUID = jk.Container.getUID;
arcademics.ColorPicker._nextUID = jk.Container._nextUID;
arcademics.ColorPicker.prototype.selectColor = function(a) {
    for (var b = 0; b < this.colorSwatches.length; b++) {
        var c = this.colorSwatches[b];
        c.color == a && this.selectColorSwatch(c)
    }
}
;
arcademics.ColorPicker.prototype.selectColorSwatch = function(a) {
    this.selectedColorSwatch && (this.selectedColorSwatch.selected = !1);
    a.selected = !0;
    this.selectedColorSwatch = a
}
;
arcademics.ColorPicker.prototype.colorSwatch_click = function(a) {
    a = a.currentTarget;
    this.selectColorSwatch(a);
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.SELECT_COLOR,null,{
        color: a.color
    }))
}
;
arcademics.ColorPicker.defaultColors = ["#0066FF", "#FFDD00", "#FF3311", "#FF9900", "#CC33FF"];
arcademics.ColorPicker.oneStarColors = ["#FF99CC", "#CC7733", "#00FF00", "#33FFFF", "#99AAAA"];
arcademics.ColorPicker.twoStarColors = ["#222222", "#FF00FF", "#EE4477", "#33CC00", "#3300FF"];
this.arcademics = this.arcademics || {};
arcademics.ColorSwatch = function() {
    jk.Container.call(this);
    this._color = "#000000";
    this._width = this._height = 100;
    var a = new jk.SVG("ColorSwatch");
    a.height = this._height;
    a.width = this._width;
    this._colorClip = this.addChild(a);
    a = new jk.Rect(0,0,this._width,this._height,{
        fill: "#000000",
        "fill-opacity": 0
    });
    this._topClip = this.addChild(a);
    a = new jk.SVG("Lock2Clip");
    a.visible = !1;
    arcademics.DisplayUtility.fit(a, 1 * this._width / 5, 1 * this._height / 5, 3 * this._width / 5, 3 * this._height / 5, "center", "center");
    this._lockClip = this.addChild(a)
}
;
$jscomp.inherits(arcademics.ColorSwatch, jk.Container);
arcademics.ColorSwatch.getUID = jk.Container.getUID;
arcademics.ColorSwatch._nextUID = jk.Container._nextUID;
$jscomp.global.Object.defineProperties(arcademics.ColorSwatch.prototype, {
    color: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._color
        },
        set: function(a) {
            this._color = a;
            this._colorClip.color = a
        }
    },
    locked: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            a ? (this._topClip.setAttribute("fill-opacity", .5),
            this._lockClip.visible = !0) : (this._topClip.setAttribute("fill-opacity", 0),
            this._lockClip.visible = !1)
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._height = a;
            this._colorClip.height = a;
            this._topClip.setAttribute("height", a);
            arcademics.DisplayUtility.fit(this._lockClip, 1 * this._width / 5, 1 * this._height / 5, 3 * this._width / 5, 3 * this._height / 5, "center", "center")
        }
    },
    selected: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            a ? (this._topClip.setAttribute("stroke", "#FFFFFF"),
            this._topClip.setAttribute("stroke-width", 4)) : (this._topClip.removeAttribute("stroke"),
            this._topClip.removeAttribute("stroke-width"))
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._width = a;
            this._colorClip.width = a;
            this._topClip.setAttribute("width", a);
            arcademics.DisplayUtility.fit(this._lockClip, 1 * this._width / 5, 1 * this._height / 5, 3 * this._width / 5, 3 * this._height / 5, "center", "center")
        }
    }
});
this.arcademics = this.arcademics || {};
var PUBLIC = "public"
  , PRIVATE = "private";
arcademics.GameList = function() {
    jk.Container.call(this);
    var a = new arcademics.GameListTab;
    a.initWidth(arcademics.Locale.loadString("PUBLIC") + " (00)");
    a.addEventListener(jk.MouseEvent.CLICK, this.publicButton_click.bind(this));
    this.publicButton = this.addChild(a);
    var b = new arcademics.GameListTab;
    b.initWidth(arcademics.Locale.loadString("PRIVATE") + " (00)");
    b.x = 620 - b.width;
    b.addEventListener(jk.MouseEvent.CLICK, this.privateButton_click.bind(this));
    this.privateButton = this.addChild(b);
    a.x = b.x - a.width;
    a = new jk.Rect(0,24,620,246,{
        fill: "#919999"
    });
    this.addChild(a);
    a = new jk.Rect(1,25,618,244,{
        fill: "#BBBBBB"
    });
    this.addChild(a);
    a = new jk.Rect(1,47,618,222,{
        fill: "#D5DDDD"
    });
    this.addChild(a);
    a = new jk.Rect(2,48,616,220,{
        fill: "#FFFFFF"
    });
    this.addChild(a);
    a = new jk.Path("M 295 52 V 264",{
        stroke: "#CCCCCC"
    });
    this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.fontWeight = "bold";
    a.text = arcademics.Locale.loadString("GAME_NAME");
    a.x = 2;
    a.y = 26;
    this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.fontWeight = "bold";
    a.text = arcademics.Locale.loadString("OF_PLAYERS");
    a.textAlign = "right";
    a.x = 292;
    a.y = 26;
    this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.fontWeight = "bold";
    a.text = arcademics.Locale.loadString("GAME_NAME");
    a.x = 307;
    a.y = 26;
    this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.fontWeight = "bold";
    a.text = arcademics.Locale.loadString("OF_PLAYERS");
    a.textAlign = "right";
    a.x = 597;
    a.y = 26;
    this.addChild(a);
    a = new jk.Container;
    a.x = 605;
    a.y = 52;
    this.scrollBar = this.addChild(a);
    b = new jk.Path("M 0 0 V 212",{
        stroke: "#CCCCCC",
        "stroke-width": .5
    });
    a.addChild(b);
    b = new jk.Container;
    b.cursor = "pointer";
    b.addEventListener(jk.Event.ADDED_TO_STAGE, this.scrollBlock_addedToStage.bind(this));
    b.addEventListener(jk.MouseEvent.MOUSE_DOWN, this.scrollBlock_mouseDown.bind(this));
    b.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.scrollBlock_removedFromStage.bind(this));
    this.scrollBlock = a.addChild(b);
    var c = new jk.Rect(-8,0,16,32,2,2,{
        fill: "#EEEEEE",
        stroke: "#AAAAAA"
    });
    b.addChild(c);
    c = new jk.Path("M -3.5 12.5 H 4.5 M -3.5 16.5 H 4.5 M -3.5 20.5 H 4.5",{
        stroke: "#CCCCCC"
    });
    b.addChild(c);
    this.items = [];
    this.slots = [];
    var d = new jk.Rect(0,0,600,220,{
        fill: "#FFFFFF"
    });
    this.addChild(d);
    c = new jk.Container;
    c.mask = d;
    c.x = 2;
    c.y = 48;
    this.addChild(c);
    d = new jk.Container;
    this.contentContainer = c.addChild(d);
    this.dragY = 0;
    this.dragHeight = a.height - b.height;
    this.displayMode = PUBLIC;
    this.refresh()
}
;
$jscomp.inherits(arcademics.GameList, jk.Container);
arcademics.GameList.getUID = jk.Container.getUID;
arcademics.GameList._nextUID = jk.Container._nextUID;
arcademics.GameList.prototype.add = function(a) {
    this.addToItems(a);
    this.isDisplayed(a) && this.addToSlots(a);
    this.refresh()
}
;
arcademics.GameList.prototype.init = function(a) {
    this.items = [];
    this.slots = [];
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        this.addToItems(c);
        this.isDisplayed(c) && this.addToSlots(c)
    }
    this.refresh()
}
;
arcademics.GameList.prototype.remove = function(a) {
    this.removeFromItems(a);
    this.removeFromSlots(a);
    this.refresh()
}
;
arcademics.GameList.prototype.update = function(a) {
    this.isDisplayed(a) ? this.updateSlot(a) : this.removeFromSlots(a);
    this.refresh()
}
;
arcademics.GameList.prototype.addToItems = function(a) {
    this.items.push(a)
}
;
arcademics.GameList.prototype.addToSlots = function(a) {
    for (var b = 0; b < this.slots.length; b++)
        if (void 0 == this.slots[b]) {
            this.slots[b] = this.createListItem(a, b);
            return
        }
    this.slots.push(this.createListItem(a, b))
}
;
arcademics.GameList.prototype.createListItem = function(a, b) {
    var c = new arcademics.GameListItem;
    c.x = b % 2 * 305;
    c.y = 22 * Math.floor(.5 * b);
    c.addEventListener(jk.MouseEvent.CLICK, this.listItem_click.bind(this));
    this.contentContainer.addChild(c);
    this.refreshListItem(c, a);
    return c
}
;
arcademics.GameList.prototype.destroyListItem = function(a) {
    this.contentContainer.removeChild(a)
}
;
arcademics.GameList.prototype.isDisplayed = function(a) {
    return (this.displayMode == PUBLIC && !a.isPrivate || this.displayMode == PRIVATE && a.isPrivate) && a.isOpen
}
;
arcademics.GameList.prototype.refresh = function() {
    for (var a = 0, b = 0, c = 0; c < this.items.length; c++) {
        var d = this.items[c];
        d.isOpen && (d.isPrivate ? b++ : a++)
    }
    this.displayMode == PUBLIC ? (this.publicButton.selected = !0,
    this.privateButton.selected = !1) : (this.publicButton.selected = !1,
    this.privateButton.selected = !0);
    this.publicButton.label = arcademics.Locale.loadString("PUBLIC") + " (" + a + ")";
    this.privateButton.label = arcademics.Locale.loadString("PRIVATE") + " (" + b + ")";
    20 < this.slots.length ? this.scrollBar.visible = !0 : (this.scrollBar.visible = !1,
    this.scrollBlock.y = 0,
    this.mouseDown = !1)
}
;
arcademics.GameList.prototype.refreshListItem = function(a, b) {
    a.item = b
}
;
arcademics.GameList.prototype.resetSlots = function() {
    for (var a = 0; a < this.slots.length; a++)
        this.slots[a] && this.destroyListItem(this.slots[a]);
    this.slots = [];
    for (a = 0; a < this.items.length; a++) {
        var b = this.items[a];
        this.isDisplayed(b) && this.addToSlots(b)
    }
    this.refresh()
}
;
arcademics.GameList.prototype.removeFromItems = function(a) {
    for (var b = 0; b < this.items.length; b++)
        if (this.items[b] && this.items[b].name == a.name) {
            this.items.splice(b, 1);
            break
        }
}
;
arcademics.GameList.prototype.removeFromSlots = function(a) {
    for (var b = 0; b < this.slots.length; b++)
        if (this.slots[b] && this.slots[b].item.name == a.name) {
            this.destroyListItem(this.slots[b]);
            this.slots[b] = void 0;
            break
        }
    for (a = this.slots.length - 1; 0 <= a; a--)
        if (void 0 == this.slots[a])
            this.slots.splice(a, 1);
        else
            break
}
;
arcademics.GameList.prototype.updateSlot = function(a) {
    for (var b = 0; b < this.slots.length; b++)
        if (this.slots[b] && this.slots[b].item.name == a.name) {
            this.refreshListItem(this.slots[b], a);
            break
        }
}
;
arcademics.GameList.prototype.addedToStage = function(a) {
    stage.addEventListener(MouseEvent.MOUSE_UP, scrollBlock_mouseUp);
    stage.addEventListener(Event.MOUSE_LEAVE, scrollBlock_mouseUp)
}
;
arcademics.GameList.prototype.listItem_click = function(a) {
    a.currentTarget.item.userCount < a.currentTarget.item.maxUsers && this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.ITEM_CLICK,null,{
        room: a.currentTarget.item
    }))
}
;
arcademics.GameList.prototype.publicButton_click = function(a) {
    this.displayMode = PUBLIC;
    this.resetSlots()
}
;
arcademics.GameList.prototype.privateButton_click = function(a) {
    this.displayMode = PRIVATE;
    this.resetSlots()
}
;
arcademics.GameList.prototype.scrollBlock_addedToStage = function(a) {
    this.lastStage = this.stage;
    this.addEventListener(jk.Event.ENTER_FRAME, this.enterFrame.bind(this));
    this.stage.addEventListener(jk.MouseEvent.MOUSE_LEAVE, this.stage_mouseLeave.bind(this));
    this.stage.addEventListener(jk.MouseEvent.MOUSE_MOVE, this.stage_mouseMove.bind(this));
    this.stage.addEventListener(jk.MouseEvent.MOUSE_UP, this.stage_mouseUp.bind(this))
}
;
arcademics.GameList.prototype.scrollBlock_mouseDown = function(a) {
    this.mouseDown = !0;
    this.lastMouseY = this.mouseY = a.stageY;
    this.dragY = this.scrollBlock.y
}
;
arcademics.GameList.prototype.scrollBlock_removedFromStage = function(a) {
    this.lastStage.removeAllEventListeners()
}
;
arcademics.GameList.prototype.stage_mouseLeave = function(a) {
    this.mouseDown = !1
}
;
arcademics.GameList.prototype.stage_mouseMove = function(a) {
    this.mouseY = a.stageY
}
;
arcademics.GameList.prototype.stage_mouseUp = function(a) {
    this.mouseDown = !1
}
;
arcademics.GameList.prototype.enterFrame = function(a) {
    this.dY = this.mouseY - this.lastMouseY;
    this.lastMouseY = this.mouseY;
    this.mouseDown && (this.dragY += this.dY);
    this.scrollBlock.y = 0 > this.dragY ? 0 : this.dragY > this.dragHeight ? this.dragHeight : this.dragY;
    this.contentContainer.y = 22 * -Math.round(this.scrollBlock.y / this.dragHeight * (Math.ceil(this.slots.length / 2) - 10))
}
;
this.arcademics = this.arcademics || {};
arcademics.GameListItem = function() {
    jk.Container.call(this);
    this._item = null;
    var a = new jk.Rect(0,0,282,22,{
        fill: "#FFE98E",
        "fill-opacity": 0
    });
    this.background = this.addChild(a);
    a = new jk.SVG("LockClip");
    a.x = 3;
    a.y = 5;
    this._lockClip = this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.width = 185;
    a.x = 15;
    a.y = 1;
    this._nameField = this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.textAlign = "center";
    a.y = 1;
    this._userCountField = this.addChild(a);
    var b = new jk.Rect(0,2,0,18,2,2,{
        fill: "#999999"
    });
    this._joinBackground = this.joinBackground = this.addChild(b);
    var c = new jk.Text;
    c.color = "#FFFFFF";
    c.fontFamily = "Arial";
    c.fontSize = 14;
    c.fontWeight = "bold";
    c.text = arcademics.Locale.loadString("JOIN_BUTTON");
    c.x = 282 - c.width - 6;
    c.y = 2;
    this.addChild(c);
    b.x = 282 - c.width - 8;
    b.width = c.width + 4;
    a.x = 282 - c.width - 8 - 28;
    this.addEventListener(jk.MouseEvent.MOUSE_DOWN, this._mouseDown.bind(this));
    this.addEventListener(jk.MouseEvent.MOUSE_ENTER, this._mouseEnter.bind(this));
    this.addEventListener(jk.MouseEvent.MOUSE_LEAVE, this._mouseLeave.bind(this))
}
;
$jscomp.inherits(arcademics.GameListItem, jk.Container);
arcademics.GameListItem.getUID = jk.Container.getUID;
arcademics.GameListItem._nextUID = jk.Container._nextUID;
arcademics.GameListItem.prototype._mouseDown = function(a) {
    this._item.userCount < this._item.maxUsers && this.background.setAttribute("fill-opacity", "0.8")
}
;
arcademics.GameListItem.prototype._mouseEnter = function(a) {
    this._item.userCount < this._item.maxUsers && (this.background.setAttribute("fill-opacity", "0.6"),
    this.joinBackground.setAttribute("fill", new jk.Gradient(jk.Gradient.LINEAR,["#FFFFFF", "#B0DFFB", "#6491D8", "#3965C4"],[1, 1, 1, 1],[0, .05, .5, 1],90)))
}
;
arcademics.GameListItem.prototype._mouseLeave = function(a) {
    this._item.userCount < this._item.maxUsers ? (this.background.setAttribute("fill-opacity", "0"),
    this.joinBackground.setAttribute("fill", "#999999")) : this.joinBackground.setAttribute("fill", "#CCCCCC")
}
;
$jscomp.global.Object.defineProperties(arcademics.GameListItem.prototype, {
    item: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._item
        },
        set: function(a) {
            this._item = a;
            a.userCount < a.maxUsers ? (this.cursor = "pointer",
            this._nameField.color = "#000000",
            this._userCountField.color = "#000000",
            this._joinBackground.setAttribute("fill", "#999999")) : (this.cursor = "default",
            this._nameField.color = "#999999",
            this._userCountField.color = "#999999",
            this._joinBackground.setAttribute("fill", "#CCCCCC"));
            this._lockClip.visible = a.isPrivate;
            this._nameField.text = a.name;
            this._userCountField.text = "(" + a.userCount + ")"
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.GameListTab = function() {
    jk.Container.call(this);
    this.cursor = "pointer";
    this.role = "tab";
    this.hoverFilter = new jk.ColorMatrixFilter(1.1,1.1,1.1);
    var a = new jk.Path("",{
        fill: "#9B9BA6"
    });
    this.background = this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.x = 10;
    a.y = 2;
    this.labelField = this.addChild(a);
    this.addEventListener(jk.MouseEvent.MOUSE_DOWN, this._mouseDown.bind(this));
    this.addEventListener(jk.MouseEvent.MOUSE_ENTER, this._mouseEnter.bind(this));
    this.addEventListener(jk.MouseEvent.MOUSE_LEAVE, this._mouseLeave.bind(this))
}
;
$jscomp.inherits(arcademics.GameListTab, jk.Container);
arcademics.GameListTab.getUID = jk.Container.getUID;
arcademics.GameListTab._nextUID = jk.Container._nextUID;
arcademics.GameListTab.prototype.initWidth = function(a) {
    this.labelField.text = a;
    this.background.d = "M 5 0 H " + (this.labelField.width + 25) + " V 24 H 0 Z";
    this.labelField.text = ""
}
;
arcademics.GameListTab.prototype._mouseDown = function(a) {
    this.filters = []
}
;
arcademics.GameListTab.prototype._mouseEnter = function(a) {
    this.filters = [this.hoverFilter]
}
;
arcademics.GameListTab.prototype._mouseLeave = function(a) {
    this.filters = []
}
;
$jscomp.global.Object.defineProperties(arcademics.GameListTab.prototype, {
    label: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.labelField.text
        },
        set: function(a) {
            this.labelField.text = a
        }
    },
    selected: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return "bold" == this.labelField.fontWeight
        },
        set: function(a) {
            a ? (this.labelField.fontWeight = "bold",
            this.background.setAttribute("fill", "#CBCBCB")) : (this.labelField.fontWeight = "normal",
            this.background.setAttribute("fill", "#9B9BA6"))
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.PlayButton = function() {
    arcademics.Button.call(this, "PlayButton");
    this._labelField.fontSize = 26;
    this._labelField.fontStyle = "italic";
    this._labelField.fontWeight = "bold";
    this._labelAdjustWidth = -44;
    this._update();
    var a = new jk.SVG("PlayChevrons");
    a.x = -21;
    a.y = 6;
    this.addChild(a);
    var b = new jk.SVG("PlayChevron");
    b.x = 6;
    b.y = 6;
    this.addChild(b);
    this.setChildIndex(this._labelField, this.numChildren - 1);
    (new jk.Tween(b,{
        loop: !0
    })).call(function() {
        b.visible = !0;
        b.x = 6
    }, 0).to({
        x: 112
    }, 1E3 / 30 * 10).call(function() {
        b.visible = !1
    }, 1E3 / 30 * 60);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.PlayButton, arcademics.Button);
arcademics.PlayButton.getUID = arcademics.Button.getUID;
arcademics.PlayButton._nextUID = arcademics.Button._nextUID;
this.arcademics = this.arcademics || {};
arcademics.PrimaryButton = function() {
    arcademics.Button.call(this, "PrimaryButton");
    this._labelField.fontSize = 18;
    this._labelField.fontStyle = "italic";
    this._labelField.fontWeight = "bold";
    this._labelAdjustWidth = -42;
    this._labelOffsetX = -6;
    this._update();
    var a = new jk.SVG("PrimaryChevron");
    a.alpha = .3;
    a.x = 118.8;
    this.chevron = this.addChild(a);
    this.setChildIndex(this._labelField, this.numChildren - 1);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.PrimaryButton, arcademics.Button);
arcademics.PrimaryButton.getUID = arcademics.Button.getUID;
arcademics.PrimaryButton._nextUID = arcademics.Button._nextUID;
arcademics.PrimaryButton.prototype._mouseEnter = function(a) {
    arcademics.Button.prototype._mouseEnter.call(this);
    (new jk.Tween(this.chevron)).to({
        alpha: .6,
        x: 0
    }, 0).to({
        alpha: .3,
        x: 118.8
    }, 1E3 / 30 * 10)
}
;
arcademics.PrimaryButton.prototype._mouseLeave = function(a) {
    arcademics.Button.prototype._mouseLeave.call(this)
}
;
this.arcademics = this.arcademics || {};
arcademics.ScrollPane = function() {
    jk.Container.call(this);
    this.mouseDown = !1;
    this.lastMouseY = this.lastMouseX = this.mouseY = this.mouseX = this.dY = this.dX = 0;
    this._width = this._height = 200;
    var a = new jk.Container;
    a.addEventListener(jk.Event.ADDED_TO_STAGE, this.contentContainer_addedToStage.bind(this));
    a.addEventListener(jk.MouseEvent.MOUSE_DOWN, this.contentContainer_mouseDown.bind(this));
    a.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.contentContainer_removedFromStage.bind(this));
    this.contentContainer = this.addChild(a);
    var b = new jk.Rect(0,0,0,0,{
        "fill-opacity": 0
    });
    this.hitArea = a.addChild(b);
    a = new jk.Rect(0,0,this._width,this._height,{
        fill: "#FFFFFF"
    });
    this.mask = this.addChild(a);
    this.lastTime = getTimer();
    this.direction = this.magnitude = 0
}
;
$jscomp.inherits(arcademics.ScrollPane, jk.Container);
arcademics.ScrollPane.getUID = jk.Container.getUID;
arcademics.ScrollPane._nextUID = jk.Container._nextUID;
arcademics.ScrollPane.prototype.reset = function() {
    this.contentContainer.x = 0;
    this.contentContainer.y = 0
}
;
arcademics.ScrollPane.prototype.scrollTo = function(a, b) {
    0 > a ? a = 0 : a > Math.max(this.contentContainer.width - this._width, 0) && (a = Math.max(this.contentContainer.width - this._width, 0));
    0 > b ? b = 0 : b > Math.max(this.contentContainer.height - this._height, 0) && (b = Math.max(this.contentContainer.height - this._height, 0));
    (new jk.Tween(this.contentContainer)).to({
        x: this.contentContainer.x - a,
        y: this.contentContainer.y - b
    }, 2E3, jk.Ease.quadInOut)
}
;
arcademics.ScrollPane.prototype.contentContainer_addedToStage = function(a) {
    this.lastStage = this.stage;
    this.addEventListener(jk.Event.ENTER_FRAME, this.enterFrame.bind(this));
    this.stage.addEventListener(jk.MouseEvent.MOUSE_LEAVE, this.stage_mouseLeave.bind(this));
    this.stage.addEventListener(jk.MouseEvent.MOUSE_MOVE, this.stage_mouseMove.bind(this));
    this.stage.addEventListener(jk.MouseEvent.MOUSE_UP, this.stage_mouseUp.bind(this))
}
;
arcademics.ScrollPane.prototype.contentContainer_mouseDown = function(a) {
    a.stageX >= this._x && a.stageX <= this._x + this._width && a.stageY >= this._y && a.stageY <= this._y + this._height && (this.mouseDown = !0,
    this.direction = this.magnitude = 0,
    this.mouseX = a.stageX,
    this.mouseY = a.stageY,
    this.lastMouseX = a.stageX,
    this.lastMouseY = a.stageY)
}
;
arcademics.ScrollPane.prototype.contentContainer_removedFromStage = function(a) {
    this.lastStage.removeAllEventListeners()
}
;
arcademics.ScrollPane.prototype.stage_mouseLeave = function(a) {
    this.mouseDown = !1
}
;
arcademics.ScrollPane.prototype.stage_mouseMove = function(a) {
    this.mouseX = a.stageX;
    this.mouseY = a.stageY
}
;
arcademics.ScrollPane.prototype.stage_mouseUp = function(a) {
    this.mouseDown && (this.magnitude = Math.sqrt(this.dX * this.dX + this.dY * this.dY),
    this.direction = Math.atan2(this.dY, this.dX));
    this.mouseDown = !1
}
;
arcademics.ScrollPane.prototype.enterFrame = function(a) {
    a = getTimer();
    var b = a - this.lastTime;
    this.lastTime = a;
    this.dX = this.mouseX - this.lastMouseX;
    this.dY = this.mouseY - this.lastMouseY;
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
    this.mouseDown && (this.contentContainer.x += this.dX,
    this.contentContainer.y += this.dY);
    0 < this.magnitude ? (this.magnitude -= .05 * b,
    0 > this.magnitude && (this.magnitude = 0)) : 0 > this.magnitude && (this.magnitude += -.05 * b,
    0 < this.magnitude && (this.magnitude = 0));
    0 != this.magnitude && (a = this.magnitude * Math.sin(this.direction),
    this.contentContainer.x += this.magnitude * Math.cos(this.direction),
    this.contentContainer.y += a);
    0 < this.contentContainer.x ? this.contentContainer.x = 0 : this.contentContainer.x < Math.min(-this.contentContainer.width + this._width, 0) && (this.contentContainer.x = Math.min(-this.contentContainer.width + this._width, 0));
    0 < this.contentContainer.y ? this.contentContainer.y = 0 : this.contentContainer.y < Math.min(-this.contentContainer.height + this._height, 0) && (this.contentContainer.y = Math.min(-this.contentContainer.height + this._height, 0));
    if (this._content.width != this.lastContentWidth || this._content.height != this.lastContentHeight)
        this.lastContentWidth = this._content.width,
        this.lastContentHeight = this._content.height,
        a = this._content.getRect(this.contentContainer),
        this.hitArea.x = a.x,
        this.hitArea.y = a.y,
        this.hitArea.width = a.width,
        this.hitArea.height = a.height
}
;
$jscomp.global.Object.defineProperties(arcademics.ScrollPane.prototype, {
    content: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this._content = a;
            this.contentContainer.removeAllChildren();
            this.contentContainer.addChild(this.hitArea);
            this.contentContainer.addChild(a)
        }
    },
    height: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._height
        },
        set: function(a) {
            this._height = a;
            this.mask.height = a
        }
    },
    width: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._width
        },
        set: function(a) {
            this._width = a;
            this.mask.width = a
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.SecondaryButton = function() {
    arcademics.Button.call(this, "SecondaryButton");
    this._labelField.fontSize = 14;
    this._labelField.fontWeight = "bold";
    this._labelAdjustWidth = -20;
    this._update();
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.SecondaryButton, arcademics.Button);
arcademics.SecondaryButton.getUID = arcademics.Button.getUID;
arcademics.SecondaryButton._nextUID = arcademics.Button._nextUID;
this.arcademics = this.arcademics || {};
arcademics.AR = {
    PLAY_BUTTON: "\u0625\u0628\u062f\u0623 \u0628\u0627\u0644\u0644\u0639\u0628",
    NEXT_BUTTON: "\u0627\u0644\u062a\u0627\u0644\u064a",
    PLAY_OFFLINE_BUTTON: "\u062a\u0644\u0639\u0628 \u0645\u0646 \u062f\u0648\u0646 \u0625\u062a\u0635\u0627\u0644",
    OK_BUTTON: "\u062d\u0633\u0646\u0627",
    PLAY_NOW_BUTTON: "\u0627\u0644\u0639\u0628 \u0627\u0644\u0627\u0646",
    CREATE_GAME_BUTTON: "\u0627\u0628\u062a\u0643\u0631 \u0644\u0639\u0628\u0629",
    CREATE_BUTTON: "\u064a\u0632\u064a\u062f",
    JOIN_BUTTON: "\u0627\u0646\u0636\u0645",
    START_BUTTON: "\u0628\u062f\u0627\u064a\u0629",
    LEAVE_BUTTON: "\u063a\u0627\u062f\u0631",
    PLAY_AGAIN_BUTTON: "\u0627\u0644\u0639\u0628 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649",
    END_GAME_BUTTON: "\u0623\u0646\u0647\u0650 \u0627\u0644\u0644\u0639\u0628\u0629",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "\u0627\u0633\u0645 \u0627\u0644\u0644\u0627\u0639\u0628",
    PLAYER_DESCRIPTION: "\u0627\u062e\u062a\u0631 \u0627\u0633\u0645\u064b\u0627 \u0645\u0645\u062a\u0639\u064b\u0627 \u0648\u0648\u062f\u0648\u062f\u064b\u0627.",
    PLAYER_PREFIX: "\u0644\u0627\u0639\u0628",
    MULTIPLAYER_FAILED: "\u0641\u0634\u0644 \u0627\u0644\u0627\u062a\u0635\u0627\u0644",
    WHY_CONNECT: "\u0644\u0645\u0627\u0630\u0627 \u0644\u0627 \u064a\u0645\u0643\u0646\u0646\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u061f",
    USERNAME_BEGIN_LETTER: "\u064a\u062c\u0628 \u0623\u0646 \u064a\u0628\u062f\u0623 \u0627\u0633\u0645\u0643 \u0628\u062d\u0631\u0641 \u0643\u0628\u064a\u0631.",
    USERNAME_ALPHANUMERIC: "\u064a\u0645\u0643\u0646 \u0623\u0646 \u064a\u062d\u062a\u0648\u064a \u0627\u0633\u0645\u0643 \u0639\u0644\u0649 \u0623\u062d\u0631\u0641 \u0648\u0623\u0631\u0642\u0627\u0645 \u0641\u0642\u0637.",
    USERNAME_END_NUMBER: "\u064a\u0645\u0643\u0646 \u0623\u0646 \u062a\u0638\u0647\u0631 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0641\u0642\u0637 \u0641\u064a \u0627\u0644\u0646\u0647\u0627\u064a\u0629.",
    LOGIN_ERROR: "\u062e\u0637\u0623 \u0641\u064a \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    USERNAME_EXISTS: "\u0627\u0644\u0627\u0633\u0645 \u0642\u064a\u062f \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0628\u0627\u0644\u0641\u0639\u0644. \u0627\u0644\u0631\u062c\u0627\u0621 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0633\u0645 \u0645\u062e\u062a\u0644\u0641.",
    USERNAME_INAPPROPRIATE: "\u0627\u0644\u0631\u062c\u0627\u0621 \u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0633\u0645 \u0623\u0643\u062b\u0631 \u0648\u062f\u064a\u0629.",
    MULTIPLAYER_LOBBY: "\u0631\u062f\u0647\u0629 \u0645\u062a\u0639\u062f\u062f\u0629 \u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646",
    PUBLIC: "\u0639\u0627\u0645",
    PRIVATE: "\u0646\u0634\u0631",
    GAME_NAME: "\u0627\u0633\u0645 \u0627\u0644\u0644\u0639\u0628\u0629",
    OF_PLAYERS: "\u0627\u0644\u0644\u0627\u0639\u0628\u064a\u0646",
    CREATE_GAME: "\u0627\u0628\u062a\u0643\u0631 \u0644\u0639\u0628\u0629",
    CREATE_GAME_DESCRIPTION: "\u0633\u064a\u062a\u0645\u0643\u0646 \u0623\u064a \u0634\u062e\u0635 \u0645\u0646 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u0644\u0639\u0628\u0629 \u0639\u0627\u0645\u0629. \u064a\u0645\u0643\u0646 \u0641\u0642\u0637 \u0644\u0644\u0627\u0639\u0628\u064a\u0646 \u0627\u0644\u0630\u064a\u0646 \u064a\u0639\u0631\u0641\u0648\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u0644\u0639\u0628\u0629 \u062e\u0627\u0635\u0629.",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: "\u0644\u0639\u0628\u0629",
    JOIN_GAME: "\u0627\u0646\u0636\u0645 \u0644\u0644\u0639\u0628\u0629",
    JOIN_GAME_DESCRIPTION: "\u0647\u0630\u0647 \u0644\u0639\u0628\u0629 \u062e\u0627\u0635\u0629. \u0627\u0643\u062a\u0628 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0644\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0644\u0639\u0628\u0629.",
    CREATE_GAME_ERROR: "\u062e\u0637\u0623",
    CREATE_GAME_ERROR_DESCRIPTION: "\u063a\u064a\u0631 \u0642\u0627\u062f\u0631 \u0639\u0644\u0649 \u0625\u0646\u0634\u0627\u0621 \u0644\u0639\u0628\u0629 \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u0648\u0642\u062a. \u062d\u0627\u0648\u0644 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u0644\u0639\u0628\u0629.",
    PASSWORD_INAPPROPRIATE: "\u0627\u062e\u062a\u0631 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0623\u0643\u062b\u0631 \u0648\u062f\u064a\u0629.",
    JOIN_GAME_ERROR: "\u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u062e\u0637\u0623 \u0627\u0644\u0644\u0639\u0628\u0629",
    JOIN_GAME_ERROR_DESCRIPTION: "\u0644\u0645 \u062a\u062a\u0645\u0643\u0646 \u0645\u0646 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u0627\u0644\u0644\u0639\u0628\u0629.",
    GAME_LOBBY: "\u0631\u062f\u0647\u0629",
    PLAYERS_READY: "\u0644\u0627\u0639\u0628\u064a\u0646 \u062c\u0627\u0647\u0632\u064a\u0646",
    RED_TEAM: "\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u062d\u0645\u0631",
    BLUE_TEAM: "\u0641\u0631\u064a\u0642 \u0623\u0632\u0631\u0642",
    GREEN_TEAM: "\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0627\u062e\u0636\u0631",
    YELLOW_TEAM: "\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u0635\u0641\u0631",
    SWITCH: "\u064a\u062a\u063a\u064a\u0631\u0648\u0646",
    TEAMS: "\u0641\u0631\u0642",
    COMPUTER_PREFIX: "\u0627\u0644\u062d\u0627\u0633\u0648\u0628",
    MAKE: "\u0635\u0646\u0639",
    QUESTION: "\u0645\u0633\u0623\u0644\u0629",
    WINNER: "\u0627\u0644\u0641\u0627\u0626\u0632",
    RESULTS: "\u0646\u062a\u0627\u0626\u062c",
    ACCURACY: "\u0635\u062d\u0629 \u0627\u0644\u0625\u062c\u0627\u0628\u0629",
    RATE: "\u0627\u0644\u0645\u0639\u062f\u0644",
    PER_MINUTE: "/\u062f\u0642\u064a\u0642\u0629",
    MISSED_QUESTIONS: "\u0623\u062c\u0627\u0628 \u0628\u0634\u0643\u0644 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d",
    POINTS: "\u0646\u0642\u0627\u0637",
    RED_TEAM_WINS: "\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u062d\u0645\u0631 \u064a\u0641\u0648\u0632",
    BLUE_TEAM_WINS: "\u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u0632\u0631\u0642 \u064a\u0641\u0648\u0632",
    CORRECT: "\u0635\u064a\u062d",
    PLACE_1: "1st",
    PLACE_2: "2nd",
    PLACE_3: "3rd",
    PLACE_4: "4th",
    PLACE_5: "5th",
    PLACE_6: "6th",
    PLACE_7: "7th",
    PLACE_8: "8th",
    PLACE_9: "9th",
    PLACE_10: "10th",
    PLACE_11: "11th",
    PLACE_12: "12th",
    SEC: "sec",
    MAIN_MENU_BUTTON: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
    NEXT_LEVEL_BUTTON: "\u0627\u0644\u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629",
    RETRY_BUTTON: "\u0623\u0639\u062f \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629",
    PRINT_BUTTON: "\u0645\u0637\u0628\u0639\u0629",
    BACK_BUTTON: "\u062e\u0644\u0641",
    PLAYER_TEXT: "\u0627\u062e\u062a\u0631 \u0627\u0633\u0645\u064b\u0627 \u0644\u0644\u0648\u062d\u0627\u062a \u0627\u0644\u0635\u062f\u0627\u0631\u0629.",
    INSTRUCTIONS: "\u062a\u0639\u0644\u064a\u0645\u0627\u062a",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "\u0627\u0644\u062e\u064a\u0627\u0631\u0627\u062a",
    CONTENT_RANGE: "\u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u062d\u062a\u0648\u0649",
    DIFFICULTY: "\u0635\u0639\u0648\u0628\u0629",
    CONTENT_TYPE: "\u0646\u0648\u0639",
    GAME_SPEED: "\u0627\u0644\u0633\u0631\u0639\u0629",
    FROM: "\u0645\u0646 \u0639\u0646\u062f",
    TO: "\u0625\u0644\u0649",
    EASY: "\u0633\u0647\u0644",
    NORMAL: "\u0637\u0628\u064a\u0639\u064a",
    HARD: "\u0634\u0627\u0642",
    ANTONYMS: "\u0627\u0644\u062a\u0636\u0627\u062f",
    SYNONYMS: "\u0627\u0644\u0645\u0631\u0627\u062f\u0641\u0627\u062a",
    HOMOPHONES: "\u0627\u0644\u0647\u0648\u0645\u0648\u0641\u0648\u0646",
    NOUNS: "\u0627\u0644\u0623\u0633\u0645\u0627\u0621",
    PRONOUNS: "\u0627\u0644\u0636\u0645\u0627\u0626\u0631",
    VERBS: "\u0623\u0641\u0639\u0627\u0644",
    ADJECTIVES: "\u0627\u0644\u0635\u0641\u0627\u062a",
    ADVERBS: "\u0627\u0644\u0636\u0645\u0627\u0626\u0631",
    PREPOSITIONS: "\u062d\u0631\u0648\u0641 \u0627\u0644\u062c\u0631",
    SLOW: "\u0628\u0637\u064a\u0621",
    TO_BE_AND_HAVE_VERBS: "\u0623\u0646 \u062a\u0643\u0648\u0646 \u0648\u0644\u062f\u064a\u0647\u0627 \u0623\u0641\u0639\u0627\u0644",
    PRESENT_TENSE: "\u0627\u0644\u0632\u0645\u0646 \u0627\u0644\u062d\u0627\u0636\u0631",
    PAST_TENSE: "\u0641\u0639\u0644 \u0645\u0627\u0636\u064a",
    PAST_PARTICIPLE: "\u0627\u0644\u0645\u0627\u0636\u064a \u0627\u0644\u062a\u0627\u0645",
    FAST: "\u0633\u0631\u064a\u0639",
    STAGE: "\u0645\u0631\u062d\u0644\u0629",
    LENGTH: "\u0637\u0648\u0644",
    STAGE_COMPLETE: "\u0627\u0643\u062a\u0645\u0644\u062a \u0627\u0644\u0645\u0631\u062d\u0644\u0629",
    STRIKE: "\u0636\u0631\u0628\u0629",
    TRY_AGAIN: "\u062d\u0627\u0648\u0644 \u0645\u062c\u062f\u062f\u0627",
    ZONE: "\u0645\u0646\u0637\u0642\u0629",
    CORRECT_ANSWER: "\u0627\u062c\u0627\u0628\u0629 \u0635\u062d\u064a\u062d\u0629",
    CORRECT_ANSWERS_NOT_STRIKED: "\u0627\u0644\u0625\u062c\u0627\u0628\u0627\u062a \u0627\u0644\u0635\u062d\u064a\u062d\u0629 - \u063a\u064a\u0631 \u0645\u062d\u0637\u0645\u0629",
    INCORRECT_ANSWERS_STRIKED: "\u0627\u0644\u0625\u062c\u0627\u0628\u0627\u062a \u063a\u064a\u0631 \u0627\u0644\u0635\u062d\u064a\u062d\u0629 - \u0645\u0634\u0637\u0648\u0628",
    YOUR_ANSWER: "\u0627\u062c\u0627\u0628\u062a\u0643",
    CONGRATULATIONS: "\u062a\u0647\u0627\u0646\u064a\u0646\u0627!",
    MISS_ANYTHING: "\u0644\u0645 \u062a\u0641\u0648\u062a \u0623\u064a \u0634\u064a\u0621.",
    SCORE: "\u0627\u0644\u0646\u062a\u064a\u062c\u0629",
    YOU_HAVE_COMPLETED: "\u0644\u0642\u062f \u0623\u0643\u0645\u0644\u062a"
};
this.arcademics = this.arcademics || {};
arcademics.EN = {
    PLAY_BUTTON: "PLAY",
    NEXT_BUTTON: "NEXT",
    PLAY_OFFLINE_BUTTON: "PLAY OFFLINE",
    OK_BUTTON: "OK",
    PLAY_NOW_BUTTON: "PLAY NOW",
    CREATE_GAME_BUTTON: "CREATE GAME",
    CREATE_BUTTON: "CREATE",
    JOIN_BUTTON: "JOIN",
    START_BUTTON: "START",
    LEAVE_BUTTON: "LEAVE",
    PLAY_AGAIN_BUTTON: "PLAY AGAIN",
    END_GAME_BUTTON: "END GAME",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "Player Name",
    PLAYER_DESCRIPTION: "Choose a fun and friendly name.",
    PLAYER_PREFIX: "Player",
    MULTIPLAYER_FAILED: "Multiplayer connection failed.",
    WHY_CONNECT: "Why can't I connect?",
    USERNAME_BEGIN_LETTER: "Your name must begin with a capital letter.",
    USERNAME_ALPHANUMERIC: "Your name can only contain letters and numbers.",
    USERNAME_END_NUMBER: "Numbers can only appear at the end of your name.",
    LOGIN_ERROR: "Login Error",
    USERNAME_EXISTS: "That name is already in use.  Please choose a different name.",
    USERNAME_INAPPROPRIATE: "Please choose a more friendly name.",
    MULTIPLAYER_LOBBY: "Multiplayer Lobby",
    PUBLIC: "Public",
    PRIVATE: "Private",
    GAME_NAME: "Game Name",
    OF_PLAYERS: "# of Players",
    CREATE_GAME: "Create Game",
    CREATE_GAME_DESCRIPTION: "Choose a password for your private game.  Leave blank for a public game.",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: "'s Game",
    JOIN_GAME: "Join Game",
    JOIN_GAME_DESCRIPTION: "This is a private game.  Enter the password to join this game.",
    CREATE_GAME_ERROR: "Create Game Error",
    CREATE_GAME_ERROR_DESCRIPTION: "You are unable to create a game at this time.  Try joining a game.",
    PASSWORD_INAPPROPRIATE: "Please choose a more friendly password.",
    JOIN_GAME_ERROR: "Join Game Error",
    JOIN_GAME_ERROR_DESCRIPTION: "You were unable to join the game.",
    GAME_LOBBY: "Lobby",
    PLAYERS_READY: "players ready",
    RED_TEAM: "Red Team",
    BLUE_TEAM: "Blue Team",
    GREEN_TEAM: "Green Team",
    YELLOW_TEAM: "Yellow Team",
    SWITCH: "SWITCH",
    TEAMS: "TEAMS",
    COMPUTER_PREFIX: "Computer",
    MAKE: "make",
    QUESTION: "QUESTION",
    WINNER: "WINNER",
    RESULTS: "Results",
    ACCURACY: "Accuracy",
    RATE: "Rate",
    PER_MINUTE: "/min",
    MISSED_QUESTIONS: "Missed Questions",
    POINTS: "Points",
    RED_TEAM_WINS: "Red Team Wins",
    BLUE_TEAM_WINS: "Blue Team Wins",
    CORRECT: "CORRECT",
    PLACE_1: "1st",
    PLACE_2: "2nd",
    PLACE_3: "3rd",
    PLACE_4: "4th",
    PLACE_5: "5th",
    PLACE_6: "6th",
    PLACE_7: "7th",
    PLACE_8: "8th",
    PLACE_9: "9th",
    PLACE_10: "10th",
    PLACE_11: "11th",
    PLACE_12: "12th",
    SEC: "sec",
    MAIN_MENU_BUTTON: "MAIN MENU",
    NEXT_LEVEL_BUTTON: "NEXT LEVEL",
    RETRY_BUTTON: "RETRY",
    PRINT_BUTTON: "PRINT",
    BACK_BUTTON: "BACK",
    PLAYER_TEXT: "Choose a name for the leaderboards.",
    INSTRUCTIONS: "Instructions",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "Options",
    CONTENT_RANGE: "Content Range",
    DIFFICULTY: "Difficulty",
    CONTENT_TYPE: "Content Type",
    GAME_SPEED: "Game Speed",
    FROM: "From",
    TO: "To",
    EASY: "Easy",
    NORMAL: "Normal",
    HARD: "Hard",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "Slow",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "Fast",
    STAGE: "Stage",
    LENGTH: "Length",
    STAGE_COMPLETE: "STAGE COMPLETE",
    STRIKE: "STRIKE",
    TRY_AGAIN: "TRY AGAIN",
    ZONE: "ZONE",
    CORRECT_ANSWER: "Correct Answer",
    CORRECT_ANSWERS_NOT_STRIKED: "Correct Answers - Not Striked",
    INCORRECT_ANSWERS_STRIKED: "Incorrect Answers - Striked",
    YOUR_ANSWER: "Your Answer",
    CONGRATULATIONS: "Congratulations!",
    MISS_ANYTHING: "You didn't miss anything.",
    SCORE: "Score",
    YOU_HAVE_COMPLETED: "You have completed"
};
this.arcademics = this.arcademics || {};
arcademics.ES = {
    PLAY_BUTTON: "JUEGUE",
    NEXT_BUTTON: "SIGUIENTE",
    PLAY_OFFLINE_BUTTON: "JUEGUE DESCONECTADO",
    OK_BUTTON: "OK",
    PLAY_NOW_BUTTON: "JUEGUE AHORA",
    CREATE_GAME_BUTTON: "CREA JUEGO",
    CREATE_BUTTON: "CREAR",
    JOIN_BUTTON: "\u00daNASE",
    START_BUTTON: "EMPIEZA",
    LEAVE_BUTTON: "DEJA",
    PLAY_AGAIN_BUTTON: "JUEGA DE NUEVO",
    END_GAME_BUTTON: "TERMINA EL JUEGO",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "Nombre De Jugador",
    PLAYER_DESCRIPTION: "Elija un nombre divertido y amable.",
    PLAYER_PREFIX: "Jugador",
    MULTIPLAYER_FAILED: "La conexi\u00f3n multijugador fall\u00f3.",
    WHY_CONNECT: "\u00bfPor qu\u00e9 no se me puede conectar?",
    USERNAME_BEGIN_LETTER: "Su nombre tiene que empezar con una letra may\u00fascula.",
    USERNAME_ALPHANUMERIC: "Su nombre solo puede contener n\u00fameros y letras.",
    USERNAME_END_NUMBER: "Los n\u00fameros solo pueden estar al final de su nombre.",
    LOGIN_ERROR: "Error De Iniciar La Sesi\u00f3n",
    USERNAME_EXISTS: "Ese nombre ya est\u00e1 en uso. Elija un nombre diferente.",
    USERNAME_INAPPROPRIATE: "Elija un nombre m\u00e1s descriptivo.",
    MULTIPLAYER_LOBBY: "",
    PUBLIC: "P\u00fablico",
    PRIVATE: "Privado",
    GAME_NAME: "Nombre De Juego",
    OF_PLAYERS: "No de jugadores",
    CREATE_GAME: "Crea Un Juego",
    CREATE_GAME_DESCRIPTION: "Elija una contrase\u00f1a para su juego privado. D\u00e9jelo en blanco para un juego p\u00fablico.",
    GAME_NAME_PREFIX: "El juego de",
    GAME_NAME_SUFFIX: "",
    JOIN_GAME: "\u00danase Al Juego",
    JOIN_GAME_DESCRIPTION: "Este es un juego privado. Ingrese la contrase\u00f1a para unirse a este juego.",
    CREATE_GAME_ERROR: "Error De Crear Un Juego",
    CREATE_GAME_ERROR_DESCRIPTION: "Usted no puede crear un juego en este momento. Trate de participar en un juego.",
    PASSWORD_INAPPROPRIATE: "Elija una contrase\u00f1a m\u00e1s amigable.",
    JOIN_GAME_ERROR: "Error En Unir El Juego",
    JOIN_GAME_ERROR_DESCRIPTION: "No se pod\u00eda unirte al juego.",
    GAME_LOBBY: "Vest\u00edbulo Del Juego",
    PLAYERS_READY: "jugadores est\u00e1n listos",
    RED_TEAM: "Equipo Rojo",
    BLUE_TEAM: "Equipo Az\u00fal",
    GREEN_TEAM: "Equipo Verde",
    YELLOW_TEAM: "Equipo Amarillo",
    SWITCH: "INTERCAMBIO",
    TEAMS: "EQUIPOS",
    COMPUTER_PREFIX: "Computadora",
    MAKE: "hacer",
    QUESTION: "Pregunta",
    WINNER: "Ganador",
    RESULTS: "Resultados",
    ACCURACY: "Precisi\u00f3n",
    RATE: "Tasa",
    PER_MINUTE: "/min",
    MISSED_QUESTIONS: "Preguntas perdidas",
    POINTS: "Puntos",
    RED_TEAM_WINS: "\u00a1Equipo rojo gana!",
    BLUE_TEAM_WINS: "\u00a1Equipo az\u00fal gana!",
    CORRECT: "CORRECTO",
    PLACE_1: "1\u00ba",
    PLACE_2: "2\u00ba",
    PLACE_3: "3\u00ba",
    PLACE_4: "4\u00ba",
    PLACE_5: "5\u00ba",
    PLACE_6: "6\u00ba",
    PLACE_7: "7\u00ba",
    PLACE_8: "8\u00ba",
    PLACE_9: "9\u00ba",
    PLACE_10: "10\u00ba",
    PLACE_11: "11\u00ba",
    PLACE_12: "12\u00ba",
    SEC: "s",
    MAIN_MENU_BUTTON: "Men\u00fa",
    NEXT_LEVEL_BUTTON: "Siguiente nivel",
    RETRY_BUTTON: "Rever",
    PRINT_BUTTON: "Impresi\u00f3n",
    BACK_BUTTON: "Atr\u00e1s",
    PLAYER_TEXT: "Elija un nombre para la tabla de clasificaci\u00f3n.",
    INSTRUCTIONS: "Instrucciones",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "Opciones",
    CONTENT_RANGE: "Rango de contenido",
    DIFFICULTY: "Dificultad",
    CONTENT_TYPE: "Tipo de contenido",
    GAME_SPEED: "Velocidad",
    FROM: "Desde",
    TO: "A",
    EASY: "F\u00e1cil",
    NORMAL: "Normal",
    HARD: "Dif\u00edcil",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "Lento",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "R\u00e1pido",
    STAGE: "Etapa",
    LENGTH: "Longitud",
    STAGE_COMPLETE: "Etapa completo",
    STRIKE: "Ataque",
    TRY_AGAIN: "Int\u00e9ntalo de nuevo",
    ZONE: "Zona",
    CORRECT_ANSWER: "Respuesta correcta",
    CORRECT_ANSWERS_NOT_STRIKED: "Respuesta correcta no elegida",
    INCORRECT_ANSWERS_STRIKED: "Respuesta incorrecta elegida",
    YOUR_ANSWER: "Tu respuesta",
    CONGRATULATIONS: "\u00a1Felicidades!",
    MISS_ANYTHING: "Respondiste todo correctamente.",
    SCORE: "Puntuaci\u00f3n",
    YOU_HAVE_COMPLETED: "Has completado."
};
this.arcademics = this.arcademics || {};
arcademics.FR = {
    PLAY_BUTTON: "JOUER",
    NEXT_BUTTON: "SUIVANT",
    PLAY_OFFLINE_BUTTON: "JOUER HORS LIGNE",
    OK_BUTTON: "OK",
    PLAY_NOW_BUTTON: "JOUER MAINTENANT",
    CREATE_GAME_BUTTON: "CR\u00c9ER UNE PARTIE",
    CREATE_BUTTON: "CR\u00c9ER",
    JOIN_BUTTON: "JOINDRE",
    START_BUTTON: "D\u00c9BUTER",
    LEAVE_BUTTON: "QUITTER",
    PLAY_AGAIN_BUTTON: "REJOUER",
    END_GAME_BUTTON: "TERMINER",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "Nom Du Joueur",
    PLAYER_DESCRIPTION: "Choisir un nom amusant et convivial.",
    PLAYER_PREFIX: "Joueur",
    MULTIPLAYER_FAILED: "",
    WHY_CONNECT: "",
    USERNAME_BEGIN_LETTER: "Votre nom doit commencer par une majuscule.",
    USERNAME_ALPHANUMERIC: "Votre nom ne peut contenir que des lettres et des chiffres.",
    USERNAME_END_NUMBER: "Les chiffres peuvent appara\u00eetre qu'\u00e0 la fin de votre nom.",
    LOGIN_ERROR: "Erreur De Connection",
    USERNAME_EXISTS: "Nom d\u00e9j\u00e0 utilis\u00e9. Veuillez en choisir un autre.",
    USERNAME_INAPPROPRIATE: "Veuillez choisir un nom plus convivial.",
    MULTIPLAYER_LOBBY: "",
    PUBLIC: "Publique",
    PRIVATE: "Priv\u00e9e",
    GAME_NAME: "Nom De La Partie",
    OF_PLAYERS: "# de joueurs",
    CREATE_GAME: "Cr\u00e9er Une Partie",
    CREATE_GAME_DESCRIPTION: "Choisissez un mot de passe pour votre partie priv\u00e9e. Laissez vide pour un jeu public.",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: "",
    JOIN_GAME: "Joindre Une Partie",
    JOIN_GAME_DESCRIPTION: "Ceci est un jeu priv\u00e9. Entrez le mot de passe pour rejoindre ce jeu.",
    CREATE_GAME_ERROR: "Erreur De Creation Du Jeu",
    CREATE_GAME_ERROR_DESCRIPTION: "Vous ne pouvez cr\u00e9er de jeu pour le moment. Tentez de joindre une partie.",
    PASSWORD_INAPPROPRIATE: "Veuillez choisir un mot de passe plus convivial.",
    JOIN_GAME_ERROR: "Erreur Pour Joindre La Partie",
    JOIN_GAME_ERROR_DESCRIPTION: "Vous n\u0092avez pu joindre la partie.",
    GAME_LOBBY: "Lobby Jeu",
    PLAYERS_READY: "joueurs sont pr\u00eats",
    RED_TEAM: "\u00c9quipe des Rouge",
    BLUE_TEAM: "\u00c9quipe des Bleu",
    GREEN_TEAM: "\u00c9quipe des Verte",
    YELLOW_TEAM: "\u00c9quipe des Jaune",
    SWITCH: "CHANGER",
    TEAMS: "D\u2019\u00c9QUIPE",
    COMPUTER_PREFIX: "Ordinateur",
    MAKE: "make",
    QUESTION: "QUESTION",
    WINNER: "WINNER",
    RESULTS: "R\u00e9sultats",
    ACCURACY: "Pr\u00e9cision",
    RATE: "Vitesse",
    PER_MINUTE: "/min",
    MISSED_QUESTIONS: "Questions Manqu\u00e9es",
    POINTS: "Points",
    RED_TEAM_WINS: "Les Rouge Gagne",
    BLUE_TEAM_WINS: "Les Bleu Gagne",
    CORRECT: "CORRECTE",
    PLACE_1: "1er",
    PLACE_2: "2i\u00e8me",
    PLACE_3: "3i\u00e8me",
    PLACE_4: "4i\u00e8me",
    PLACE_5: "5i\u00e8me",
    PLACE_6: "6i\u00e8me",
    PLACE_7: "7i\u00e8me",
    PLACE_8: "8i\u00e8me",
    PLACE_9: "9i\u00e8me",
    PLACE_10: "10i\u00e8me",
    PLACE_11: "11i\u00e8me",
    PLACE_12: "12i\u00e8me",
    SEC: "sec",
    MAIN_MENU_BUTTON: "MENU PRINCIPAL",
    NEXT_LEVEL_BUTTON: "NIVEAU SUIVANT",
    RETRY_BUTTON: "R\u00c9ESSAYEZ",
    PRINT_BUTTON: "IMPRESSION",
    BACK_BUTTON: "RETOUR",
    PLAYER_TEXT: "Choisissez un nom pour les classements.",
    INSTRUCTIONS: "Instructions",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "Options",
    CONTENT_RANGE: "Gamme de contenu",
    DIFFICULTY: "Difficult\u00e9",
    CONTENT_TYPE: "Type de contenu",
    GAME_SPEED: "Vitesse de jeu",
    FROM: "De",
    TO: "\u00c0",
    EASY: "Facile",
    NORMAL: "Ordinaire",
    HARD: "Dure",
    ANTONYMS: "Antonymes",
    SYNONYMS: "Synonymes",
    HOMOPHONES: "Homophones",
    NOUNS: "Noms",
    PRONOUNS: "Pronoms",
    VERBS: "Verbes",
    ADJECTIVES: "Adjectifs",
    ADVERBS: "Les adverbes",
    PREPOSITIONS: "Pr\u00e9positions",
    SLOW: "Lente",
    TO_BE_AND_HAVE_VERBS: "\u00catre et avoir des verbes",
    PRESENT_TENSE: "Pr\u00e9sent",
    PAST_TENSE: "Pass\u00e9",
    PAST_PARTICIPLE: "Participe pass\u00e9",
    FAST: "Vite",
    STAGE: "\u00c9tape",
    LENGTH: "Longueur",
    STAGE_COMPLETE: "\u00c9TAPE TERMIN\u00c9E",
    STRIKE: "LA GR\u00c8VE",
    TRY_AGAIN: "R\u00c9ESSAYER",
    ZONE: "ZONE",
    CORRECT_ANSWER: "Bonne r\u00e9ponse",
    CORRECT_ANSWERS_NOT_STRIKED: "R\u00e9ponses correctes - Non frapp\u00e9",
    INCORRECT_ANSWERS_STRIKED: "R\u00e9ponses incorrectes - Frapp\u00e9",
    YOUR_ANSWER: "Ta R\u00e9ponse",
    CONGRATULATIONS: "Toutes nos f\u00e9licitations!",
    MISS_ANYTHING: "Vous n'avez rien manqu\u00e9.",
    SCORE: "But",
    YOU_HAVE_COMPLETED: "Vous avez termin\u00e9"
};
this.arcademics = this.arcademics || {};
arcademics.HI = {
    PLAY_BUTTON: "\u0938\u094d\u091f\u093e\u0930\u094d\u091f",
    NEXT_BUTTON: "\u0906\u0917\u0947",
    PLAY_OFFLINE_BUTTON: "\u0911\u092b\u093c\u0932\u093e\u0907\u0928 \u0916\u0947\u0932\u0947\u0902",
    OK_BUTTON: "\u0920\u0940\u0915",
    PLAY_NOW_BUTTON: "\u0905\u092c \u0916\u0947\u0932\u0947\u0902",
    CREATE_GAME_BUTTON: "\u0916\u0947\u0932 \u092c\u0928\u093e\u0913",
    CREATE_BUTTON: "\u0938\u0943\u091c\u0928\u093e",
    JOIN_BUTTON: "\u091c\u0941\u0921\u093c\u0928\u093e",
    START_BUTTON: "\u0936\u0941\u0930\u0942",
    LEAVE_BUTTON: "\u091b\u094b\u0921\u093c\u0928\u093e",
    PLAY_AGAIN_BUTTON: "\u092a\u0941\u0928\u0930\u094d\u092a\u094d\u0930\u093e\u0930\u0902\u092d \u0915\u0930\u0947\u0902",
    END_GAME_BUTTON: "\u0938\u092e\u093e\u092a\u094d\u0924",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "\u0916\u093f\u0932\u093e\u0921\u093f \u0915\u093e \u0928\u093e\u092e",
    PLAYER_DESCRIPTION: "\u090f\u0915 \u092e\u091c\u0947\u0926\u093e\u0930 \u0914\u0930 \u0926\u094b\u0938\u094d\u0924\u093e\u0928\u093e \u0928\u093e\u092e \u091a\u0941\u0928\u0947\u0902\u0964",
    PLAYER_PREFIX: "\u0916\u093f\u0932\u093e\u0921\u093c\u0940",
    MULTIPLAYER_FAILED: "\u0915\u0928\u0947\u0915\u094d\u0936\u0928 \u0935\u093f\u092b\u0932",
    WHY_CONNECT: "\u092e\u0948\u0902 \u0915\u094d\u092f\u094b\u0902 \u0928\u0939\u0940\u0902 \u091c\u0941\u0921\u093c \u0938\u0915\u0924\u093e?",
    USERNAME_BEGIN_LETTER: "\u0906\u092a\u0915\u093e \u0928\u093e\u092e \u090f\u0915 \u092c\u0921\u093c\u0947 \u0905\u0915\u094d\u0937\u0930 \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094b\u0928\u093e \u091a\u093e\u0939\u093f\u090f\u0964",
    USERNAME_ALPHANUMERIC: "\u0906\u092a\u0915\u0947 \u0928\u093e\u092e \u092e\u0947\u0902 \u0915\u0947\u0935\u0932 \u0905\u0915\u094d\u0937\u0930 \u0914\u0930 \u0938\u0902\u0916\u094d\u092f\u093e\u090f\u0901 \u0939\u094b \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964",
    USERNAME_END_NUMBER: "\u0928\u0902\u092c\u0930 \u0915\u0947\u0935\u0932 \u0906\u092a\u0915\u0947 \u0928\u093e\u092e \u0915\u0947 \u0905\u0902\u0924 \u092e\u0947\u0902 \u0926\u093f\u0916\u093e\u0908 \u0926\u0947 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
    LOGIN_ERROR: "\u0932\u0949\u0917\u093f\u0928 \u0924\u094d\u0930\u0941\u091f\u093f",
    USERNAME_EXISTS: "\u0935\u0939 \u0928\u093e\u092e \u092a\u0939\u0932\u0947 \u0938\u0947 \u0939\u0940 \u0909\u092a\u092f\u094b\u0917 \u092e\u0947\u0902 \u0939\u0948\u0964 \u0915\u0943\u092a\u092f\u093e \u0915\u094b\u0908 \u0926\u0942\u0938\u0930\u093e \u0928\u093e\u092e \u091a\u0941\u0928\u0947\u0902\u0964",
    USERNAME_INAPPROPRIATE: "\u0915\u0943\u092a\u092f\u093e \u0905\u0927\u093f\u0915 \u0905\u0928\u0941\u0915\u0942\u0932 \u0928\u093e\u092e \u091a\u0941\u0928\u0947\u0902\u0964",
    MULTIPLAYER_LOBBY: "\u092e\u0932\u094d\u091f\u0940\u092a\u094d\u0932\u0947\u092f\u0930 \u0932\u0949\u092c\u0940",
    PUBLIC: "\u091c\u0928\u0924\u093e",
    PRIVATE: "\u0928\u093f\u091c\u0940",
    GAME_NAME: "\u0916\u0947\u0932 \u0915\u093e \u0928\u093e\u092e",
    OF_PLAYERS: "\u0916\u093f\u0932\u093e\u0921\u093c\u093f\u092f\u094b\u0902",
    CREATE_GAME: "\u0916\u0947\u0932 \u092c\u0928\u093e\u0913",
    CREATE_GAME_DESCRIPTION: "\u0905\u092a\u0928\u0947 \u0928\u093f\u091c\u0940 \u0917\u0947\u092e \u0915\u0947 \u0932\u093f\u090f \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u091a\u0941\u0928\u0947\u0902\u0964 \u090f\u0915 \u0938\u093e\u0930\u094d\u0935\u091c\u0928\u093f\u0915 \u0917\u0947\u092e \u0915\u0947 \u0932\u093f\u090f \u0916\u093e\u0932\u0940 \u091b\u094b\u0921\u093c \u0926\u0947\u0902\u0964",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: "'s \u0916\u0947\u0932",
    JOIN_GAME: "\u091c\u0941\u0921\u093c\u0928\u093e",
    JOIN_GAME_DESCRIPTION: "\u092f\u0939 \u090f\u0915 \u0928\u093f\u091c\u0940 \u0916\u0947\u0932 \u0939\u0948\u0964 \u0907\u0938 \u0917\u0947\u092e \u092e\u0947\u0902 \u0936\u093e\u092e\u093f\u0932 \u0939\u094b\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0921\u093e\u0932\u0947\u0902\u0964",
    CREATE_GAME_ERROR: "\u0917\u0947\u092e \u090f\u0930\u0930 \u092c\u0928\u093e\u090f\u0902",
    CREATE_GAME_ERROR_DESCRIPTION: "\u0906\u092a \u0907\u0938 \u0938\u092e\u092f \u0917\u0947\u092e \u092c\u0928\u093e\u0928\u0947 \u092e\u0947\u0902 \u0905\u0938\u092e\u0930\u094d\u0925 \u0939\u0948\u0902\u0964 \u0915\u093f\u0938\u0940 \u0916\u0947\u0932 \u092e\u0947\u0902 \u0936\u093e\u092e\u093f\u0932 \u0939\u094b\u0928\u0947 \u0915\u093e \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964",
    PASSWORD_INAPPROPRIATE: "\u0915\u0943\u092a\u092f\u093e \u0905\u0927\u093f\u0915 \u0905\u0928\u0941\u0915\u0942\u0932 \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u091a\u0941\u0928\u0947\u0902\u0964",
    JOIN_GAME_ERROR: "\u0917\u0947\u092e \u090f\u0930\u0930 \u092e\u0947\u0902 \u0936\u093e\u092e\u093f\u0932 \u0939\u094b\u0902",
    JOIN_GAME_ERROR_DESCRIPTION: "\u0906\u092a \u0916\u0947\u0932 \u092e\u0947\u0902 \u0936\u093e\u092e\u093f\u0932 \u0928\u0939\u0940\u0902 \u0939\u094b \u092a\u093e\u090f\u0964",
    GAME_LOBBY: "\u0932\u0949\u092c\u0940",
    PLAYERS_READY: "\u0916\u093f\u0932\u093e\u0921\u093c\u0940 \u0924\u0948\u092f\u093e\u0930",
    RED_TEAM: "\u0932\u093e\u0932 \u0938\u092e\u0942\u0939",
    BLUE_TEAM: "\u0928\u0940\u0932\u0940 \u091f\u0940\u092e",
    GREEN_TEAM: "\u0939\u0930\u0940 \u091f\u0940\u092e",
    YELLOW_TEAM: "\u092a\u0940\u0932\u0940 \u091f\u0940\u092e",
    SWITCH: "\u0938\u094d\u0935\u093f\u091a",
    TEAMS: "\u091f\u0940\u092e\u094b\u0902",
    COMPUTER_PREFIX: "\u0938\u0902\u0917\u0923\u0915",
    MAKE: "\u092c\u0928\u093e\u0928\u093e",
    QUESTION: "\u0938\u0935\u093e\u0932",
    WINNER: "\u0935\u093f\u091c\u0947\u0924\u093e",
    RESULTS: "\u092a\u0930\u093f\u0923\u093e\u092e",
    ACCURACY: "\u0936\u0941\u0926\u094d\u0927\u0924\u093e",
    RATE: "\u0917\u0924\u093f",
    PER_MINUTE: "/\u092e\u093f\u0928\u091f",
    MISSED_QUESTIONS: "\u091b\u0942\u091f \u0917\u090f \u0938\u0935\u093e\u0932",
    POINTS: "\u0905\u0902\u0915",
    RED_TEAM_WINS: "\u0930\u0947\u0921 \u091f\u0940\u092e \u091c\u0940\u0924 \u0917\u0908",
    BLUE_TEAM_WINS: "\u092c\u094d\u0932\u0942 \u091f\u0940\u092e \u091c\u0940\u0924 \u0917\u0908",
    CORRECT: "\u0938\u0939\u0940",
    PLACE_1: "1st",
    PLACE_2: "2nd",
    PLACE_3: "3rd",
    PLACE_4: "4th",
    PLACE_5: "5th",
    PLACE_6: "6th",
    PLACE_7: "7th",
    PLACE_8: "8th",
    PLACE_9: "9th",
    PLACE_10: "10th",
    PLACE_11: "11th",
    PLACE_12: "12th",
    SEC: "\u0938\u0947\u0915\u0902\u0921",
    MAIN_MENU_BUTTON: "\u092e\u0941\u0916\u094d\u092f \u092e\u0947\u0928\u0942",
    NEXT_LEVEL_BUTTON: "\u0905\u0917\u0932\u093e \u0938\u094d\u0924\u0930",
    RETRY_BUTTON: "\u092a\u0941\u0928: \u092a\u094d\u0930\u092f\u093e\u0938",
    PRINT_BUTTON: "\u092a\u094d\u0930\u093f\u0902\u091f",
    BACK_BUTTON: "\u0935\u093e\u092a\u0938",
    PLAYER_TEXT: "\u0932\u0940\u0921\u0930\u092c\u094b\u0930\u094d\u0921 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u0928\u093e\u092e \u091a\u0941\u0928\u0947\u0902\u0964",
    INSTRUCTIONS: "\u0905\u0928\u0941\u0926\u0947\u0936",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "\u0935\u093f\u0915\u0932\u094d\u092a",
    CONTENT_RANGE: "\u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u0930\u0947\u0902\u091c",
    DIFFICULTY: "\u0915\u0920\u093f\u0928\u093e\u0908",
    CONTENT_TYPE: "\u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u092a\u094d\u0930\u0915\u093e\u0930",
    GAME_SPEED: "\u0916\u0947\u0932 \u0915\u0940 \u0917\u0924\u093f",
    FROM: "\u0938\u0947",
    TO: "\u0924\u0915",
    EASY: "\u0906\u0938\u093e\u0928",
    NORMAL: "\u0938\u093e\u0927\u093e\u0930\u0923",
    HARD: "\u0915\u0920\u093f\u0928",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "\u0927\u0940\u0930\u0947",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "\u0924\u0947\u091c",
    STAGE: "\u092e\u0902\u091a",
    LENGTH: "\u0932\u0902\u092c\u093e\u0908",
    STAGE_COMPLETE: "\u091a\u0930\u0923 \u092a\u0942\u0930\u093e \u0915\u0930\u0947\u0902",
    STRIKE: "\u092a\u094d\u0930\u0939\u093e\u0930",
    TRY_AGAIN: "\u092a\u0941\u0928\u0903 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902",
    ZONE: "\u0915\u094d\u0937\u0947\u0924\u094d\u0930",
    CORRECT_ANSWER: "\u0938\u0939\u0940 \u0909\u0924\u094d\u0924\u0930",
    CORRECT_ANSWERS_NOT_STRIKED: "\u0938\u0939\u0940 \u0909\u0924\u094d\u0924\u0930 \u0928\u0939\u0940\u0902 \u091a\u0941\u0928\u093e \u0917\u092f\u093e",
    INCORRECT_ANSWERS_STRIKED: "\u0917\u0932\u0924 \u0909\u0924\u094d\u0924\u0930 \u091a\u0941\u0928\u093e \u0917\u092f\u093e",
    YOUR_ANSWER: "\u0906\u092a\u0915\u093e \u0909\u0924\u094d\u0924\u0930",
    CONGRATULATIONS: "\u092c\u0927\u093e\u0908 \u0939\u094b",
    MISS_ANYTHING: "\u0906\u092a\u0928\u0947 \u0938\u092d\u0940 \u0938\u0939\u0940 \u0909\u0924\u094d\u0924\u0930 \u0926\u093f\u090f",
    SCORE: "\u0938\u094d\u0915\u094b\u0930",
    YOU_HAVE_COMPLETED: "\u0906\u092a\u0928\u0947 \u092a\u0942\u0930\u093e \u0915\u093f\u092f\u093e"
};
this.arcademics = this.arcademics || {};
arcademics.NL = {
    PLAY_BUTTON: "SPELEN",
    NEXT_BUTTON: "VOLGENDE",
    PLAY_OFFLINE_BUTTON: "OFFLINE SPELEN",
    OK_BUTTON: "OK",
    PLAY_NOW_BUTTON: "NU SPELEN",
    CREATE_GAME_BUTTON: "NIEUW SPEL",
    CREATE_BUTTON: "NIEUW",
    JOIN_BUTTON: "MEEDOEN",
    START_BUTTON: "START",
    LEAVE_BUTTON: "VERLAAT",
    PLAY_AGAIN_BUTTON: "SPEEL OPNIEUW",
    END_GAME_BUTTON: "STOPPEN",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "Naam Speler",
    PLAYER_DESCRIPTION: "Kies een leuke naam.",
    PLAYER_PREFIX: "Speler",
    MULTIPLAYER_FAILED: "Fout in het verbinden met andere spelers.",
    WHY_CONNECT: "Waarom kan ik niet verbinden?",
    USERNAME_BEGIN_LETTER: "Je naam moet met een hoofdletter beginnen.",
    USERNAME_ALPHANUMERIC: "Je naam mag alleen letters en cijfers bevatten.",
    USERNAME_END_NUMBER: "Nummers kun je alleen aan het einde van een naam gebruiken.",
    LOGIN_ERROR: "Inlog Fout",
    USERNAME_EXISTS: "Die naam bestaat al. Kies een andere naam.",
    USERNAME_INAPPROPRIATE: "Kies een vriendelijkere naam.",
    MULTIPLAYER_LOBBY: "",
    PUBLIC: "Iedereen",
    PRIVATE: "Vrienden",
    GAME_NAME: "Spelnaam",
    OF_PLAYERS: "Aantal spelers",
    CREATE_GAME: "Nieuw spel",
    CREATE_GAME_DESCRIPTION: "Kies een wachtwoord voor je priv\u00e9spel. Laat leeg voor een openbare game.",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: "'s Spel",
    JOIN_GAME: "Doe mee met een spel!",
    JOIN_GAME_DESCRIPTION: "Dit is een priv\u00e9spel. Voer het wachtwoord in om mee te doen aan dit spel.",
    CREATE_GAME_ERROR: "Fout bij spel maken",
    CREATE_GAME_ERROR_DESCRIPTION: "Je kunt nu geen spel maken. Probeer mee te doen bij een spel.",
    PASSWORD_INAPPROPRIATE: "Kies een vriendelijker wachtwoord.",
    JOIN_GAME_ERROR: "Fout in meedoen met een spel",
    JOIN_GAME_ERROR_DESCRIPTION: "Het was niet mogelijk om met het spel mee te doen.",
    GAME_LOBBY: "Teams",
    PLAYERS_READY: "spelers zijn er klaar voor",
    RED_TEAM: "Rode Team",
    BLUE_TEAM: "Blauwe Team",
    GREEN_TEAM: "Groene team",
    YELLOW_TEAM: "Gele team",
    SWITCH: "WISSEL",
    TEAMS: "TEAMS",
    COMPUTER_PREFIX: "Computer",
    MAKE: "maken",
    QUESTION: "Vraag",
    WINNER: "Winnaar",
    RESULTS: "Resultaten",
    ACCURACY: "Nauwkeurigheid",
    RATE: "Snelheid",
    PER_MINUTE: "/min",
    MISSED_QUESTIONS: "Gemaakte Fouten",
    POINTS: "Punten",
    RED_TEAM_WINS: "Rood Wint",
    BLUE_TEAM_WINS: "Blauw Wint",
    CORRECT: "GOED",
    PLACE_1: "1e",
    PLACE_2: "2e",
    PLACE_3: "3e",
    PLACE_4: "4e",
    PLACE_5: "5e",
    PLACE_6: "6e",
    PLACE_7: "7e",
    PLACE_8: "8e",
    PLACE_9: "9e",
    PLACE_10: "10e",
    PLACE_11: "11e",
    PLACE_12: "12e",
    SEC: "sec",
    MAIN_MENU_BUTTON: "Hoofdmenu",
    NEXT_LEVEL_BUTTON: "Volgende niveau",
    RETRY_BUTTON: "Opnieuw",
    PRINT_BUTTON: "Afdrukken",
    BACK_BUTTON: "Terug",
    PLAYER_TEXT: "Kies een naam voor de scoreborden.",
    INSTRUCTIONS: "Instructies",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "Opties",
    CONTENT_RANGE: "Inhoudsbereik",
    DIFFICULTY: "Moeilijkheid",
    CONTENT_TYPE: "Inhoudstype",
    GAME_SPEED: "Snelheid",
    FROM: "Van",
    TO: "Naar",
    EASY: "Makkelijk",
    NORMAL: "Normaal",
    HARD: "Moeilijk",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "Langzaam",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "Snel",
    STAGE: "Stadium",
    LENGTH: "Lengte",
    STAGE_COMPLETE: "Fase voltooid",
    STRIKE: "Slaan",
    TRY_AGAIN: "Opnieuw",
    ZONE: "ZONE",
    CORRECT_ANSWER: "Goed antwoord",
    CORRECT_ANSWERS_NOT_STRIKED: "Juist antwoord niet gekozen",
    INCORRECT_ANSWERS_STRIKED: "Onjuist antwoord gekozen",
    YOUR_ANSWER: "Uw antwoord",
    CONGRATULATIONS: "efeliciteerd!",
    MISS_ANYTHING: "Je hebt goed geantwoord.",
    SCORE: "Score",
    YOU_HAVE_COMPLETED: "Je hebt voltooid."
};
this.arcademics = this.arcademics || {};
arcademics.PT = {
    PLAY_BUTTON: "JOGAR",
    NEXT_BUTTON: "PR\u00d3XIMO",
    PLAY_OFFLINE_BUTTON: "JOGAR OFFLINE",
    OK_BUTTON: "OK",
    PLAY_NOW_BUTTON: "JOGAR AGORA",
    CREATE_GAME_BUTTON: "CRIAR JOGO",
    CREATE_BUTTON: "CRIAR",
    JOIN_BUTTON: "INGRESSAR",
    START_BUTTON: "COME\u00c7AR",
    LEAVE_BUTTON: "SAIR",
    PLAY_AGAIN_BUTTON: "JOGAR DE NOVO",
    END_GAME_BUTTON: "TERMINAR JOGO",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "Nome Do Jogador",
    PLAYER_DESCRIPTION: "Escolha um nome divertido e amig\u00e1vel.",
    PLAYER_PREFIX: "Jogador",
    MULTIPLAYER_FAILED: "A conex\u00e3o multiplayer falhou.",
    WHY_CONNECT: "Por Que n\u00e3o consigo me conectar?",
    USERNAME_BEGIN_LETTER: "Seu nome precisa come\u00e7ar com uma letra mai\u00fascula.",
    USERNAME_ALPHANUMERIC: "Somente letras e n\u00fameros s\u00e3o aceitos em seu nome.",
    USERNAME_END_NUMBER: "N\u00fameros s\u00f3 podem aparecer no final de seu nome.",
    LOGIN_ERROR: "Erro De Login",
    USERNAME_EXISTS: "Este nome j\u00e1 est\u00e1 em uso.  Escolha um nome diferente.",
    USERNAME_INAPPROPRIATE: "Escolha um nome mais amig\u00e1vel.",
    MULTIPLAYER_LOBBY: "",
    PUBLIC: "P\u00fablico",
    PRIVATE: "Privado",
    GAME_NAME: "Nome Do Jogo",
    OF_PLAYERS: "N\u00ba de jogadores",
    CREATE_GAME: "Criar Jogo",
    CREATE_GAME_DESCRIPTION: "Escolha uma senha para o seu jogo privado. Deixe em branco para um jogo p\u00fablico.",
    GAME_NAME_PREFIX: "Jogo de ",
    GAME_NAME_SUFFIX: "",
    JOIN_GAME: "Ingressar No Jogo",
    JOIN_GAME_DESCRIPTION: "Este \u00e9 um jogo privado. Digite a senha para entrar neste jogo.",
    CREATE_GAME_ERROR: "Erro De Cria\u00e7\u00e3o Do Jogo",
    CREATE_GAME_ERROR_DESCRIPTION: "N\u00e3o foi poss\u00edvel criar um jogo nesse momento.  Tente ingressar em um jogo existente.",
    PASSWORD_INAPPROPRIATE: "Escolha uma senha mais amig\u00e1vel.",
    JOIN_GAME_ERROR: "Erro Ao Ingressar No Jogo",
    JOIN_GAME_ERROR_DESCRIPTION: "N\u00e3o oi poss\u00edvel ingressar no jogo.",
    GAME_LOBBY: "Lobby De Jogo",
    PLAYERS_READY: "os jogadores est\u00e3o prontos",
    RED_TEAM: "Time Vermelho",
    BLUE_TEAM: "Time Azul",
    GREEN_TEAM: "Time Verde",
    YELLOW_TEAM: "Time Amarela",
    SWITCH: "TROCAR",
    TEAMS: "TIMES",
    COMPUTER_PREFIX: "Computador",
    MAKE: "fa\u00e7o",
    QUESTION: "Quest\u00e3o",
    WINNER: "Ganhar",
    RESULTS: "Resultados",
    ACCURACY: "Precis\u00e3o",
    RATE: "Taxa",
    PER_MINUTE: "/min",
    MISSED_QUESTIONS: "Quest\u00f5es Perdidas",
    POINTS: "Pontos",
    RED_TEAM_WINS: "O Time Vermelho Venceu",
    BLUE_TEAM_WINS: "O Time Azul Venceu",
    CORRECT: "CORRETO",
    PLACE_1: "1\u00ba",
    PLACE_2: "2\u00ba",
    PLACE_3: "3\u00ba",
    PLACE_4: "4\u00ba",
    PLACE_5: "5\u00ba",
    PLACE_6: "6\u00ba",
    PLACE_7: "7\u00ba",
    PLACE_8: "8\u00ba",
    PLACE_9: "9\u00ba",
    PLACE_10: "10\u00ba",
    PLACE_11: "11\u00ba",
    PLACE_12: "12\u00ba",
    SEC: "s",
    MAIN_MENU_BUTTON: "Menu principal",
    NEXT_LEVEL_BUTTON: "Pr\u00f3ximo n\u00edvel",
    RETRY_BUTTON: "Novamente",
    PRINT_BUTTON: "Impress\u00e3o",
    BACK_BUTTON: "De volta",
    PLAYER_TEXT: "Escolha um nome para o placar.",
    INSTRUCTIONS: "Instru\u00e7\u00f5es",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "Op\u00e7\u00f5es",
    CONTENT_RANGE: "Alcance",
    DIFFICULTY: "Dificuldade",
    CONTENT_TYPE: "Tipo",
    GAME_SPEED: "Rapidez",
    FROM: "De",
    TO: "Para",
    EASY: "F\u00e1cil",
    NORMAL: "Normal",
    HARD: "Dif\u00edcil",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "Lento",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "Velocidade",
    STAGE: "Palco",
    LENGTH: "Dura\u00e7\u00e3o",
    STAGE_COMPLETE: "Etapa completa",
    STRIKE: "Greve",
    TRY_AGAIN: "Novamente",
    ZONE: "Zona",
    CORRECT_ANSWER: "Resposta correta",
    CORRECT_ANSWERS_NOT_STRIKED: "Resposta correta n\u00e3o escolhida",
    INCORRECT_ANSWERS_STRIKED: "Resposta incorreta escolhida",
    YOUR_ANSWER: "Sua resposta",
    CONGRATULATIONS: "Parab\u00e9ns!",
    MISS_ANYTHING: "Voce nao perdeu nada.",
    SCORE: "Ponto",
    YOU_HAVE_COMPLETED: "Voc\u00ea completou"
};
this.arcademics = this.arcademics || {};
arcademics.RU = {
    PLAY_BUTTON: "\u041d\u0430\u0447\u0430\u043b\u043e",
    NEXT_BUTTON: "P\u044f\u0434\u043e\u043c",
    PLAY_OFFLINE_BUTTON: "O\u0444\u043b\u0430\u0439\u043d-\u0438\u0433\u0440\u0430",
    OK_BUTTON: "\u0415\u0441\u0442\u044c",
    PLAY_NOW_BUTTON: "\u0418\u0433\u0440\u0430\u0442\u044c \u0441\u0435\u0439\u0447\u0430\u0441",
    CREATE_GAME_BUTTON: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0438\u0433\u0440\u0443",
    CREATE_BUTTON: "\u0441\u043e\u0437\u0438\u0434\u0430\u0442\u044c",
    JOIN_BUTTON: "\u0432\u0441\u0442\u0443\u043f\u0430\u0442\u044c",
    START_BUTTON: "\u041d\u0430\u0447\u0438\u043d\u0430\u0442\u044c",
    LEAVE_BUTTON: "\u041f\u043e\u043a\u0438\u043d\u0443\u0442\u044c",
    PLAY_AGAIN_BUTTON: "\u0418\u0433\u0440\u0430\u0442\u044c \u0441\u043d\u043e\u0432\u0430",
    END_GAME_BUTTON: "\u041a\u043e\u043d\u0435\u0446",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "\u0418\u043c\u044f \u0438\u0433\u0440\u043e\u043a\u0430",
    PLAYER_DESCRIPTION: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u043e\u043d\u044f\u0442\u043d\u043e\u0435 \u0438\u043c\u044f.",
    PLAYER_PREFIX: "\u0418\u0433\u0440\u043e\u043a",
    MULTIPLAYER_FAILED: "\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f.",
    WHY_CONNECT: "\u041f\u043e\u0447\u0435\u043c\u0443 \u043d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438?",
    USERNAME_BEGIN_LETTER: "\u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u0438\u043c\u044f \u0441 \u0437\u0430\u0433\u043b\u0430\u0432\u043d\u043e\u0439 \u0431\u0443\u043a\u0432\u044b.",
    USERNAME_ALPHANUMERIC: "\u0418\u043c\u044f \u0441\u043e\u0441\u0442\u043e\u0438\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0438\u0437 \u0431\u0443\u043a\u0432 \u0438 \u0446\u0438\u0444\u0440.",
    USERNAME_END_NUMBER: "\u0426\u0438\u0444\u0440\u044b \u043c\u043e\u0433\u0443\u0442 \u0431\u044b\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u0432 \u043a\u043e\u043d\u0446\u0435 \u0438\u043c\u0435\u043d\u0438.",
    LOGIN_ERROR: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u0445\u043e\u0434\u0430",
    USERNAME_EXISTS: "\u0418\u043c\u044f \u0443\u0436\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0435 \u0438\u043c\u044f.",
    USERNAME_INAPPROPRIATE: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u043e\u043b\u0435\u0435 \u043f\u043e\u043d\u044f\u0442\u043d\u043e\u0435 \u0438\u043c\u044f.",
    MULTIPLAYER_LOBBY: "\u0418\u0433\u0440\u043e\u0432\u043e\u0435 \u043b\u043e\u0431\u0431\u0438",
    PUBLIC: "\u041e\u0431\u0449\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0435",
    PRIVATE: "\u0427\u0430\u0441\u0442\u043d\u044b\u0439",
    GAME_NAME: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0438\u0433\u0440\u044b",
    OF_PLAYERS: "# \u0418\u0433\u0440\u043e\u043a\u0438",
    CREATE_GAME: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0438\u0433\u0440\u0443",
    CREATE_GAME_DESCRIPTION: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c \u0434\u043b\u044f \u0432\u0430\u0448\u0435\u0439 \u0447\u0430\u0441\u0442\u043d\u043e\u0439 \u0438\u0433\u0440\u044b. \u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043f\u043e\u043b\u0435 \u043f\u0443\u0441\u0442\u044b\u043c \u0434\u043b\u044f \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u043e\u0439 \u0438\u0433\u0440\u044b.",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: " \u0418\u0433\u0440\u0430",
    JOIN_GAME: "\u0412\u043e\u0439\u0442\u0438 \u0432 \u0438\u0433\u0440\u0443",
    JOIN_GAME_DESCRIPTION: "\u042d\u0442\u043e \u0447\u0430\u0441\u0442\u043d\u0430\u044f \u0438\u0433\u0440\u0430. \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c\u0441\u044f \u043a \u044d\u0442\u043e\u0439 \u0438\u0433\u0440\u0435.",
    CREATE_GAME_ERROR: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f \u0438\u0433\u0440\u044b",
    CREATE_GAME_ERROR_DESCRIPTION: "\u0412 \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0435 \u0432\u0440\u0435\u043c\u044f \u0432\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u0442\u0435 \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u0438\u0433\u0440\u0443. \u041f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u044f\u0439\u0442\u0435\u0441\u044c \u043a \u0438\u0433\u0440\u0435.",
    PASSWORD_INAPPROPRIATE: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u043e\u043b\u0435\u0435 \u0443\u0434\u043e\u0431\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c.",
    JOIN_GAME_ERROR: "\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u044f",
    JOIN_GAME_ERROR_DESCRIPTION: "\u041d\u0435\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e \u043f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c\u0441\u044f \u043a \u0438\u0433\u0440\u0435.",
    GAME_LOBBY: "Lobby",
    PLAYERS_READY: "players ready",
    RED_TEAM: "Red Team",
    BLUE_TEAM: "Blue Team",
    GREEN_TEAM: "Green Team",
    YELLOW_TEAM: "Yellow Team",
    SWITCH: "SWITCH",
    TEAMS: "TEAMS",
    COMPUTER_PREFIX: "Computer",
    MAKE: "\u0441\u0434\u0435\u043b\u0430\u0442\u044c",
    QUESTION: "\u0412\u043e\u043f\u0440\u043e\u0441",
    WINNER: "\u041f\u043e\u0431\u0435\u0434\u0438\u0442\u0435\u043b\u044c",
    RESULTS: "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442",
    ACCURACY: "\u0422\u043e\u0447\u043d\u043e\u0441\u0442\u044c",
    RATE: "\u0421\u0442\u0430\u0432\u043a\u0430",
    PER_MINUTE: "/\u043c\u0438\u043d\u0443\u0442\u0430",
    MISSED_QUESTIONS: "\u041d\u0435\u0432\u0435\u0440\u043d\u043e",
    POINTS: "\u0422\u043e\u0447\u043a\u0438",
    RED_TEAM_WINS: "\u043a\u043e\u043c\u0430\u043d\u0434\u0430 \u043a\u0440\u0430\u0441\u043d\u0430\u044f \u043f\u043e\u0431\u0435\u0434\u0430",
    BLUE_TEAM_WINS: "\u043a\u043e\u043c\u0430\u043d\u0434\u0430 \u0441\u0438\u043d\u044f\u044f \u043f\u043e\u0431\u0435\u0434\u0430",
    CORRECT: "\u0412\u0435\u0440\u043d\u044b\u0439",
    PLACE_1: "1st",
    PLACE_2: "2nd",
    PLACE_3: "3rd",
    PLACE_4: "4th",
    PLACE_5: "5th",
    PLACE_6: "6th",
    PLACE_7: "7th",
    PLACE_8: "8th",
    PLACE_9: "9th",
    PLACE_10: "10th",
    PLACE_11: "11th",
    PLACE_12: "12th",
    SEC: "\u0441\u0435\u043a\u0443\u043d\u0434\u0430",
    MAIN_MENU_BUTTON: "\u041c\u0435\u043d\u044e",
    NEXT_LEVEL_BUTTON: "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0443\u0440\u043e\u0432\u0435\u043d\u044c",
    RETRY_BUTTON: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
    PRINT_BUTTON: "\u041f\u0435\u0447\u0430\u0442\u0430\u0442\u044c",
    BACK_BUTTON: "\u0412\u0435\u0440\u043d\u0438\u0441\u044c",
    PLAYER_TEXT: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u043c\u044f \u0434\u043b\u044f \u0442\u0430\u0431\u043b\u0438\u0446\u044b \u043b\u0438\u0434\u0435\u0440\u043e\u0432.",
    INSTRUCTIONS: "\u0438\u043d\u0441\u0442\u0440\u0443\u043a\u0446\u0438\u0438",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b",
    CONTENT_RANGE: "\u0421\u043f\u0435\u043a\u0442\u0440",
    DIFFICULTY: "T\u0440\u0443\u0434\u043d\u043e\u0441\u0442\u044c",
    CONTENT_TYPE: "\u0422\u0438\u043f",
    GAME_SPEED: "\u0431\u044b\u0441\u0442\u0440\u043e\u0442\u0430",
    FROM: "\u0418\u0437",
    TO: "\u0427\u0442\u043e\u0431\u044b",
    EASY: "\u041b\u0435\u0433\u043a\u043e",
    NORMAL: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442",
    HARD: "\u0422\u0440\u0443\u0434\u043d\u043e",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "\u041c\u0435\u0434\u043b\u0435\u043d\u043d\u044b\u0439",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "\u0431\u044b\u0441\u0442\u0440\u044b\u0439",
    STAGE: "\u0441\u0442\u0430\u0434\u0438\u044f",
    LENGTH: "\u0414\u043b\u0438\u043d\u0430",
    STAGE_COMPLETE: "\u042d\u0442\u0430\u043f \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d",
    STRIKE: "\u0443\u0434\u0430\u0440",
    TRY_AGAIN: "\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0441\u043d\u043e\u0432\u0430",
    ZONE: "\u0417\u043e\u043d\u0430",
    CORRECT_ANSWER: "\u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043e\u0442\u0432\u0435\u0442",
    CORRECT_ANSWERS_NOT_STRIKED: "\u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0435 \u043e\u0442\u0432\u0435\u0442\u044b \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u044b",
    INCORRECT_ANSWERS_STRIKED: "\u0412\u044b\u0431\u0440\u0430\u043d\u044b \u043d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0435 \u043e\u0442\u0432\u0435\u0442\u044b",
    YOUR_ANSWER: "\u0412\u0430\u0448 \u043e\u0442\u0432\u0435\u0442",
    CONGRATULATIONS: "\u041f\u043e\u0437\u0434\u0440\u0430\u0432\u043b\u044f\u044e!",
    MISS_ANYTHING: "\u0412\u0441\u0435 \u043e\u0442\u0432\u0435\u0442\u044b \u0432\u0435\u0440\u043d\u044b.",
    SCORE: "\u0441\u0447\u0435\u0442",
    YOU_HAVE_COMPLETED: "\u0412\u044b \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043b\u0438"
};
this.arcademics = this.arcademics || {};
arcademics.VI = {
    PLAY_BUTTON: "B\u1eaft \u0111\u1ea7u",
    NEXT_BUTTON: "K\u1ebf ti\u1ebfp",
    PLAY_OFFLINE_BUTTON: "Ch\u01a1i ngo\u1ea1i tuy\u1ebfn",
    OK_BUTTON: "\u0110\u1ed3ng \u00fd",
    PLAY_NOW_BUTTON: "B\u1eaft \u0111\u1ea7u ch\u01a1i",
    CREATE_GAME_BUTTON: "T\u1ea1o tr\u00f2 ch\u01a1i",
    CREATE_BUTTON: "T\u1ea1o n\u00ean",
    JOIN_BUTTON: "Tham gia",
    START_BUTTON: "Kh\u1edfi \u0111\u1ea7u",
    LEAVE_BUTTON: "R\u1eddi kh\u1ecfi",
    PLAY_AGAIN_BUTTON: "Ch\u01a1i l\u1ea1i",
    END_GAME_BUTTON: "T\u00e0n cu\u1ed9c",
    COPYRIGHT: "\u00a9 2022 Arcademics",
    PLAYER_NAME: "T\u00ean ng\u01b0\u1eddi ch\u01a1i",
    PLAYER_DESCRIPTION: "Nh\u1eadp m\u1ed9t c\u00e1i t\u00ean vui v\u1ebb v\u00e0 th\u00e2n thi\u1ec7n.",
    PLAYER_PREFIX: "Ng\u01b0\u1eddi ch\u01a1i",
    MULTIPLAYER_FAILED: "K\u1ebft n\u1ed1i th\u1ea5t b\u1ea1i",
    WHY_CONNECT: "T\u1ea1i sao t\u00f4i kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i?",
    USERNAME_BEGIN_LETTER: "T\u00ean c\u1ee7a b\u1ea1n ph\u1ea3i b\u1eaft \u0111\u1ea7u b\u1eb1ng m\u1ed9t ch\u1eef c\u00e1i vi\u1ebft hoa.",
    USERNAME_ALPHANUMERIC: "T\u00ean c\u1ee7a b\u1ea1n ch\u1ec9 c\u00f3 th\u1ec3 ch\u1ee9a c\u00e1c ch\u1eef c\u00e1i v\u00e0 s\u1ed1.",
    USERNAME_END_NUMBER: "S\u1ed1 ch\u1ec9 c\u00f3 th\u1ec3 xu\u1ea5t hi\u1ec7n \u1edf cu\u1ed1i t\u00ean c\u1ee7a b\u1ea1n.",
    LOGIN_ERROR: "L\u1ed7i \u0111\u0103ng nh\u1eadp",
    USERNAME_EXISTS: "T\u00ean \u0111\u00f3 \u0111\u00e3 \u0111\u01b0\u1ee3c s\u1eed d\u1ee5ng. Vui l\u00f2ng ch\u1ecdn m\u1ed9t t\u00ean kh\u00e1c.",
    USERNAME_INAPPROPRIATE: "H\u00e3y ch\u1ecdn m\u1ed9t c\u00e1i t\u00ean th\u00e2n thi\u1ec7n h\u01a1n.",
    MULTIPLAYER_LOBBY: "S\u1ea3nh nhi\u1ec1u ng\u01b0\u1eddi ch\u01a1i",
    PUBLIC: "C\u00f4ng c\u1ed9ng",
    PRIVATE: "Ri\u00eang t\u01b0",
    GAME_NAME: "T\u00ean c\u1ee7a tr\u00f2 ch\u01a1i",
    OF_PLAYERS: "Ng\u01b0\u1eddi ch\u01a1i",
    CREATE_GAME: "T\u1ea1o tr\u00f2 ch\u01a1i",
    CREATE_GAME_DESCRIPTION: "Ch\u1ecdn m\u1eadt kh\u1ea9u cho tr\u00f2 ch\u01a1i ri\u00eang t\u01b0 c\u1ee7a b\u1ea1n. \u0110\u1ec3 tr\u1ed1ng cho m\u1ed9t tr\u00f2 ch\u01a1i c\u00f4ng khai.",
    GAME_NAME_PREFIX: "",
    GAME_NAME_SUFFIX: "'s tr\u00f2 ch\u01a1i",
    JOIN_GAME: "Tham gia",
    JOIN_GAME_DESCRIPTION: "\u0110\u00e2y l\u00e0 m\u1ed9t tr\u00f2 ch\u01a1i ri\u00eang t\u01b0. Nh\u1eadp m\u1eadt kh\u1ea9u \u0111\u1ec3 tham gia tr\u00f2 ch\u01a1i n\u00e0y.",
    CREATE_GAME_ERROR: "T\u1ea1o l\u1ed7i tr\u00f2 ch\u01a1i",
    CREATE_GAME_ERROR_DESCRIPTION: "B\u1ea1n kh\u00f4ng th\u1ec3 t\u1ea1o tr\u00f2 ch\u01a1i v\u00e0o l\u00fac n\u00e0y. H\u00e3y th\u1eed tham gia m\u1ed9t tr\u00f2 ch\u01a1i.",
    PASSWORD_INAPPROPRIATE: "Vui l\u00f2ng ch\u1ecdn m\u1ed9t m\u1eadt kh\u1ea9u th\u00e2n thi\u1ec7n h\u01a1n.",
    JOIN_GAME_ERROR: "L\u1ed7i tham gia tr\u00f2 ch\u01a1i",
    JOIN_GAME_ERROR_DESCRIPTION: "B\u1ea1n kh\u00f4ng th\u1ec3 tham gia tr\u00f2 ch\u01a1i.",
    GAME_LOBBY: "S\u1ea3nh \u0111\u1ee3i",
    PLAYERS_READY: "s\u1eb5n s\u00e0ng",
    RED_TEAM: "\u0110\u1ed9i \u0111\u1ecf",
    BLUE_TEAM: "\u0110\u1ed9i xanh",
    GREEN_TEAM: "\u0110\u1ed9i m\u00e0u xanh c\u00e2y",
    YELLOW_TEAM: "\u0110\u1ed9i v\u00e0ng",
    SWITCH: "Chuy\u1ec3n",
    TEAMS: "Nh\u00f3m",
    COMPUTER_PREFIX: "M\u00e1y vi t\u00ednh",
    MAKE: "l\u00e0m",
    QUESTION: "C\u00e2u h\u1ecfi",
    WINNER: "Th\u1eafng",
    RESULTS: "C\u00e1c k\u1ebft qu\u1ea3",
    ACCURACY: "S\u1ef1 ch\u00ednh x\u00e1c",
    RATE: "gi\u00e1",
    PER_MINUTE: "/ph\u00fat",
    MISSED_QUESTIONS: "C\u00e2u h\u1ecfi b\u1ecb b\u1ecf l\u1ee1",
    POINTS: "\u0110i\u1ec3m",
    RED_TEAM_WINS: "\u0110\u1ed9i \u0111\u1ecf th\u1eafng",
    BLUE_TEAM_WINS: "\u0110\u1ed9i Xanh th\u1eafng",
    CORRECT: "\u0111\u00fang",
    PLACE_1: "1st",
    PLACE_2: "2nd",
    PLACE_3: "3rd",
    PLACE_4: "4th",
    PLACE_5: "5th",
    PLACE_6: "6th",
    PLACE_7: "7th",
    PLACE_8: "8th",
    PLACE_9: "9th",
    PLACE_10: "10th",
    PLACE_11: "11th",
    PLACE_12: "12th",
    SEC: "sec",
    MAIN_MENU_BUTTON: "Th\u1ef1c \u0111\u01a1n",
    NEXT_LEVEL_BUTTON: "C\u1ea5p \u0111\u1ed9 ti\u1ebfp",
    RETRY_BUTTON: "Th\u1eed l\u1ea1i",
    PRINT_BUTTON: "In",
    BACK_BUTTON: "Tr\u1edf l\u1ea1i",
    PLAYER_TEXT: "Ch\u1ecdn t\u00ean cho b\u1ea3ng th\u00e0nh t\u00edch.",
    INSTRUCTIONS: "H\u01b0\u1edbng d\u1eabn",
    INSTRUCTIONS_TEXT: "",
    OPTIONS: "T\u00f9y ch\u1ecdn",
    CONTENT_RANGE: "Ph\u1ea1m vi",
    DIFFICULTY: "Kh\u00f3 kh\u0103n",
    CONTENT_TYPE: "Lo\u1ea1i n\u1ed9i dung",
    GAME_SPEED: "T\u1ed1c \u0111\u1ed9",
    FROM: "T\u1eeb",
    TO: "\u0110\u1ebfn",
    EASY: "D\u1ec5 d\u00e0ng",
    NORMAL: "Th\u01b0\u1eddng",
    HARD: "Kh\u00f3 kh\u0103n",
    ANTONYMS: "Antonyms",
    SYNONYMS: "Synonyms",
    HOMOPHONES: "Homophones",
    NOUNS: "Nouns",
    PRONOUNS: "Pronouns",
    VERBS: "Verbs",
    ADJECTIVES: "Adjectives",
    ADVERBS: "Adverbs",
    PREPOSITIONS: "Prepositions",
    SLOW: "Ch\u1eadm",
    TO_BE_AND_HAVE_VERBS: "To Be And Have Verbs",
    PRESENT_TENSE: "Present Tense",
    PAST_TENSE: "Past Tense",
    PAST_PARTICIPLE: "Past Participle",
    FAST: "Nhanh",
    STAGE: "S\u00e2n kh\u1ea5u",
    LENGTH: "Chi\u1ec1u d\u00e0i",
    STAGE_COMPLETE: "Ho\u00e0n th\u00e0nh",
    STRIKE: "Soi qua",
    TRY_AGAIN: "Th\u1eed l\u1ea1i",
    ZONE: "Khu",
    CORRECT_ANSWER: "Tr\u1ea3 l\u1eddi ch\u00ednh x\u00e1c",
    CORRECT_ANSWERS_NOT_STRIKED: "C\u00e2u tr\u1ea3 l\u1eddi \u0111\u00fang kh\u00f4ng \u0111\u01b0\u1ee3c ch\u1ecdn",
    INCORRECT_ANSWERS_STRIKED: "C\u00e2u tr\u1ea3 l\u1eddi \u0111\u00e3 ch\u1ecdn sai",
    YOUR_ANSWER: "C\u00e2u tr\u1ea3 c\u1ee7a b\u1ea1n",
    CONGRATULATIONS: "Xin ch\u00fac m\u1eebng!",
    MISS_ANYTHING: "C\u00e2u tr\u1ea3 l\u1eddi c\u1ee7a b\u1ea1n l\u00e0 \u0111\u00fang",
    SCORE: "Ghi b\u00e0n",
    YOU_HAVE_COMPLETED: "B\u1ea1n \u0111\u00e3 ho\u00e0n th\u00e0nh"
};
this.arcademics = this.arcademics || {};
arcademics.Locale = function() {
    throw "Locale cannot be instantiated.";
}
;
arcademics.Locale.loadLanguage = function(a) {
    this._language = a
}
;
arcademics.Locale.loadString = function(a) {
    return this._language[a]
}
;
this.arcademics = this.arcademics || {};
arcademics.CountdownClip = function() {
    jk.Container.call(this);
    var a = new jk.Container;
    this.mask = this.addChild(a);
    var b = new jk.Rect(0,0,100,100,{
        fill: "#FFFFFF"
    });
    a.addChild(b);
    b = new jk.Text;
    b.color = "#000000";
    b.fontFamily = "Verdana";
    b.fontSize = 96;
    b.textAlign = "center";
    b.x = 50;
    b.y = -12;
    this.labelField = a.addChild(b);
    b = new jk.Rect(0,0,100,100,{
        fill: "#FFFFFF",
        "fill-opacity": "0.6"
    });
    this.foregroundBox = this.addChild(b);
    this.mask = a;
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.CountdownClip, jk.Container);
arcademics.CountdownClip.getUID = jk.Container.getUID;
arcademics.CountdownClip._nextUID = jk.Container._nextUID;
$jscomp.global.Object.defineProperties(arcademics.CountdownClip.prototype, {
    label: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.labelField.text
        },
        set: function(a) {
            this.labelField.text = a
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.GameBase = function() {
    jk.Container.call(this);
    this.gameTitle = arcademics.Settings.gameTitle;
    this.numOfPlayers = arcademics.Settings.numOfPlayers;
    this.gameType = arcademics.Settings.gameType;
    this.scoreType = arcademics.Settings.scoreType;
    this.multiClient = arcademics.Settings.multiClient;
    this.service = arcademics.Settings.service;
    this.myPlayer = arcademics.Settings.myPlayer;
    this.playerId = arcademics.Settings.playerId;
    this.players = arcademics.Settings.players;
    this.started = !1;
    this.stopped = !0;
    this.time = getTimer();
    this.released = !0;
    this.gameInstance = new arcademics.GameInstance;
    this.misses = this.hits = 0;
    this.responses = [];
    this.compMaxAccuracy = .95;
    this.compMinAccuracy = .75;
    this.compMaxRate = 40;
    this.compMinRate = 20;
    this.preGameTimer = new jk.Timer(1E3,3);
    this.preGameTimer.addEventListener(jk.Event.TIMER, this.preGameTimer_timer.bind(this));
    this.preGameTimer.addEventListener(jk.Event.TIMER_COMPLETE, this.preGameTimer_timerComplete.bind(this));
    this.postGameTimer = new jk.Timer(2E3,1);
    this.postGameTimer.addEventListener(jk.Event.TIMER_COMPLETE, this.postGameTimer_timerComplete.bind(this));
    this.hitTimer = new jk.Timer(0,1);
    this.hitTimer.addEventListener(jk.Event.TIMER_COMPLETE, this.hitTimer_timerComplete.bind(this));
    this.missTimer = new jk.Timer(1250,1);
    this.missTimer.addEventListener(jk.Event.TIMER_COMPLETE, this.missTimer_timerComplete.bind(this));
    this.resultsMessageTimer = new jk.Timer(0,1);
    this.resultsMessageTimer.addEventListener(jk.Event.TIMER_COMPLETE, this.resultsMessageTimer_timerComplete.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.REMOVE_USER, this.multiClient_removeUser.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.ROOM_MESSAGE, this.multiClient_roomMessage.bind(this));
    this.addEventListener(jk.Event.ENTER_FRAME, this.enterFrame.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
    this.processStartMessage();
    this.updatePlayers()
}
;
$jscomp.inherits(arcademics.GameBase, jk.Container);
arcademics.GameBase.getUID = jk.Container.getUID;
arcademics.GameBase._nextUID = jk.Container._nextUID;
arcademics.GameBase.prototype.nextQuestion = function() {}
;
arcademics.GameBase.prototype.playerBooster = function(a) {}
;
arcademics.GameBase.prototype.playerHit = function(a) {}
;
arcademics.GameBase.prototype.playerLightning = function(a) {}
;
arcademics.GameBase.prototype.playerMiss = function(a) {}
;
arcademics.GameBase.prototype.playerMove = function(a) {}
;
arcademics.GameBase.prototype.processStartMessage = function() {
    this.contentManager = new arcademics.ContentManager([],arcademics.ContentManager.PARTIAL_SHUFFLE);
    arcademics.Settings.content ? (this.contentManager.parseArray(arcademics.Settings.content),
    this.contentManager.shuffle()) : this.contentManager.parseArray(arcademics.Settings.startMessage.content)
}
;
arcademics.GameBase.prototype.showPreGameCountdown = function() {}
;
arcademics.GameBase.prototype.showPostGameMessage = function() {}
;
arcademics.GameBase.prototype.startGame = function() {
    this.started = !0;
    this.stopped = !1;
    this.startTime = getTimer();
    this.released = !0;
    this.powerUpSprite.points = arcademics.Settings.powerUpPoints;
    for (var a = (this.compMaxAccuracy - this.compMinAccuracy) / (this.players.length - 1), b = (this.compMaxRate - this.compMinRate) / (this.players.length - 1), c = arcademics.RandomUtility.getPermutation(this.players.length), d = arcademics.RandomUtility.getPermutation(this.players.length), e = 0; e < this.players.length; e++)
        this.players[e].hits = 0,
        this.players[e].misses = 0,
        this.players[c[e]].accuracy = this.compMaxAccuracy - e * a,
        this.players[d[e]].rate = this.compMaxRate - e * b,
        this.players[d[e]].timer = 60 / this.players[d[e]].rate * 1E3 + 1E3;
    "Poki" == arcademics.Settings.affiliate && PokiSDK.gameplayStart();
    "Together" == arcademics.Settings.affiliate && arcademics.Settings.gameplayStartCallback()
}
;
arcademics.GameBase.prototype.stopGame = function(a) {
    this.stopped = !0;
    this.resultsMessageTimer.stop();
    isNaN(this.finishTime) && (this.finishTime = this.time);
    var b = this.finishTime - this.startTime;
    if (0 < a.length)
        for (var c = 0; c < this.players.length; c++)
            this.players[c].score = a[c];
    a = 1;
    for (c = 0; c < this.players.length; c++)
        this.scoreType == arcademics.ScoreType.SCORE ? this.players[c].score > this.players[this.playerId].score && a++ : this.scoreType == arcademics.ScoreType.TIME && this.players[c].score < this.players[this.playerId].score && a++;
    c = this.myPlayer.name;
    var d = void 0;
    this.gameType == arcademics.GameType.FFA ? d = this.myPlayer.score : this.gameType == arcademics.GameType.TEAM2 ? d = Math.floor(b / this.hits) : this.gameType == arcademics.GameType.TEAM4 && (d = this.players[this.playerId].score);
    this.gameInstance.hits = this.hits;
    this.gameInstance.misses = this.misses;
    this.gameInstance.time = b;
    this.gameInstance.responses = this.responses;
    this.gameInstance.place = a;
    this.gameInstance.playerName = c;
    this.gameInstance.score = d;
    arcademics.Settings.lastGameInstance = this.gameInstance;
    arcademics.Settings.service.saveData(this.gameInstance);
    "DiscoveryEd" != arcademics.Settings.affiliate && arcademics.Settings.gaTracker.trackGameplay(arcademics.Settings.gameTitle, this.gameInstance.rate);
    this.multiClient.leaveRoom();
    "Poki" == arcademics.Settings.affiliate && (1 == a ? PokiSDK.happyTime(1) : 2 == a ? PokiSDK.happyTime(.5) : 3 == a && PokiSDK.happyTime(.25),
    PokiSDK.gameplayStop());
    "Together" == arcademics.Settings.affiliate && arcademics.Settings.gameplayStopCallback();
    this.showPostGameMessage()
}
;
arcademics.GameBase.prototype.update = function(a) {
    if (this.started && !this.stopped && this.isHost)
        for (a = 0; a < this.players.length; a++)
            if ("computer" == this.players[a].type && this.players[a].timer < this.elapsedTime) {
                for (var b = 0, c = 0, d = 0; d < this.players.length; d++)
                    "human" == this.players[d].type && (b += this.players[d].hits,
                    c += 1);
                b = 1E3 * Math.random() + 60 / ((this.players[a].rate + b / c / this.elapsedTime * 6E4) / 2) * 1E3 - 500;
                1 > 1 / this.players[a].accuracy * Math.random() ? this.multiClient.sendRoomMessage({
                    hit: a
                }) : this.multiClient.sendRoomMessage({
                    miss: a
                });
                this.players[a].timer = this.elapsedTime + b
            }
}
;
arcademics.GameBase.prototype.updatePlayers = function() {
    var a = this.multiClient.myRoom.users;
    a[0].name == this.multiClient.myUser.name && (this.isHost = !0);
    for (var b = 0; b < this.players.length; b++) {
        "human" == this.players[b].type && (this.players[b].type = "computer");
        for (var c = 0; c < a.length; c++)
            this.players[b].name == a[c].name && (this.players[b].type = "human")
    }
}
;
arcademics.GameBase.prototype.usePowerUp = function(a) {
    "booster" == a && arcademics.Settings.powerUpPoints >= arcademics.Settings.POINTS_BOOSTER ? (arcademics.Settings.powerUpPoints -= arcademics.Settings.POINTS_BOOSTER,
    this.powerUpSprite.points = arcademics.Settings.powerUpPoints,
    this.powerUpSprite.booster(),
    jk.Sound.play(arcademics.Settings.boosterSound),
    this.service.usePowerUp("booster"),
    this.multiClient.sendRoomMessage({
        booster: this.playerId
    })) : "lightning" == a && arcademics.Settings.powerUpPoints >= arcademics.Settings.POINTS_LIGHTNING && (arcademics.Settings.powerUpPoints -= arcademics.Settings.POINTS_LIGHTNING,
    this.powerUpSprite.points = arcademics.Settings.powerUpPoints,
    this.powerUpSprite.lightning(),
    jk.Sound.play(arcademics.Settings.lightningSound),
    this.service.usePowerUp("lightning"),
    this.multiClient.sendRoomMessage({
        lightning: this.playerId
    }))
}
;
arcademics.GameBase.prototype.preGameTimer_timer = function(a) {}
;
arcademics.GameBase.prototype.preGameTimer_timerComplete = function(a) {
    this.startGame()
}
;
arcademics.GameBase.prototype.postGameTimer_timerComplete = function(a) {
    arcademics.ScreenManager.show(arcademics.ResultsScreen)
}
;
arcademics.GameBase.prototype.hitTimer_timerComplete = function(a) {
    this.nextQuestion()
}
;
arcademics.GameBase.prototype.missTimer_timerComplete = function(a) {
    this.nextQuestion()
}
;
arcademics.GameBase.prototype.resultsMessageTimer_timerComplete = function(a) {}
;
arcademics.GameBase.prototype.multiClient_removeUser = function(a) {
    this.updatePlayers()
}
;
arcademics.GameBase.prototype.multiClient_roomMessage = function(a) {
    a = a.params.message;
    for (var b in a)
        if ("hit" == b)
            this.players[a[b]].hits++,
            this.playerHit(a[b]);
        else if ("miss" == b)
            this.players[a[b]].misses++,
            this.playerMiss(a[b]);
        else if ("move" == b)
            this.playerMove(a[b]);
        else if ("generateAnswer" == b)
            this.processGenerateBallMessage(a[b]);
        else if ("booster" == b)
            this.playerBooster(a[b]);
        else if ("lightning" == b)
            this.playerLightning(a[b]);
        else if ("stopGame" == b) {
            if (this.stopped)
                break;
            this.stopGame(a[b])
        }
}
;
arcademics.GameBase.prototype.enterFrame = function(a) {
    this.lastTime = this.time;
    this.time = getTimer();
    this.elapsedTime = this.time - this.startTime;
    this.update(this.time - this.lastTime)
}
;
arcademics.GameBase.prototype.removedFromStage = function(a) {
    this.preGameTimer.stop();
    this.preGameTimer.stop();
    this.postGameTimer.stop();
    this.hitTimer.stop();
    this.missTimer.stop();
    this.resultsMessageTimer.stop();
    this.multiClient.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.GameInstance = function() {
    this.time = this.misses = this.hits = 0;
    this.responses = [];
    this.stage;
    this.passed;
    this.place;
    this.playerName;
    this.score;
    this.hitsOffset;
    this.missesOffset;
    this.timeOffset
}
;
arcademics.GameInstance.prototype.addResponse = function(a, b, c) {
    if (a.correctAnswer == b)
        return this.hits++,
        this.responses.push(new arcademics.Response(a.question,a.correctAnswer,b,!0,c)),
        !0;
    this.misses++;
    this.responses.push(new arcademics.Response(a.question,a.correctAnswer,b,!1,c));
    return !1
}
;
arcademics.GameInstance.prototype.getMissedItems = function(a) {
    for (var b = [], c = [], d = 0; d < this.responses.length && b.length < a; d++) {
        var e = this.responses[d];
        e.correct || c[e.question] || (c[e.question] = !0,
        b.push({
            question: e.question,
            correctAnswer: e.correctAnswer,
            userAnswer: e.userAnswer
        }))
    }
    return b
}
;
$jscomp.global.Object.defineProperties(arcademics.GameInstance.prototype, {
    accuracy: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 0 == this.hits + this.misses ? 0 : Math.floor(this.hits / (this.hits + this.misses) * 100)
        }
    },
    rate: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 0 == this.time ? 0 : Math.floor(this.hits / (this.time / 6E4))
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.Response = function(a, b, c, d, e) {
    this.question = a;
    this.correctAnswer = b;
    this.userAnswer = c;
    this.correct = d;
    this.time = e
}
;
this.arcademics = this.arcademics || {};
arcademics.WinnerClip = function() {
    jk.Container.call(this);
    var a = new jk.SVG("WinnerStar");
    a.alpha = 0;
    a.scaleX = .75;
    a.scaleY = .75;
    a.x = -45;
    a.y = 10;
    this.addChild(a);
    (new jk.Tween(a)).to({
        alpha: 1
    }, 1E3 / 30 * 7);
    a = new jk.SVG("WinnerStar");
    a.alpha = 0;
    a.scaleX = .75;
    a.scaleY = .75;
    a.x = 45;
    a.y = 10;
    this.addChild(a);
    (new jk.Tween(a)).wait(1E3 / 30 * 5).to({
        alpha: 1
    }, 1E3 / 30 * 7);
    a = new jk.SVG("WinnerStar");
    a.alpha = 0;
    this.addChild(a);
    (new jk.Tween(a)).wait(1E3 / 30 * 9).to({
        alpha: 1
    }, 1E3 / 30 * 7);
    a = new jk.Text;
    a.alpha = 0;
    a.fontFamily = "Arial";
    a.fontSize = 20;
    a.fontWeight = "bold";
    a.text = arcademics.Locale.loadString("WINNER");
    a.textAlign = "center";
    a.y = -12;
    this.addChild(a);
    (new jk.Tween(a)).wait(1E3 / 30 * 15).to({
        alpha: 1
    }, 1E3 / 30 * 12)
}
;
$jscomp.inherits(arcademics.WinnerClip, jk.Container);
arcademics.WinnerClip.getUID = jk.Container.getUID;
arcademics.WinnerClip._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.OvalRaceCrowd = function() {
    jk.Container.call(this);
    var a = [{
        numSeats: 18,
        scale: .75,
        xOffset: 28,
        yOffset: 24
    }, {
        numSeats: 18,
        scale: .675,
        xOffset: 42,
        yOffset: 50
    }, {
        numSeats: 17,
        scale: .6,
        xOffset: 64,
        yOffset: 70
    }]
      , b = new jk.SVG("OvalRaceBleachers");
    this.addChild(b);
    var c = [];
    for (b = 0; 3 > b; b++)
        for (var d = a[b], e = 0; e < d.numSeats; e++)
            if (!(.1 > Math.random())) {
                var f = new arcademics.OvalRaceSpectator;
                f.scaleX = d.scale;
                f.scaleY = d.scale;
                f.x = 40 * e + d.xOffset + arcademics.RandomUtility.randomInteger(-2, 2);
                f.x0 = f.x;
                f.x1 = f.x + arcademics.RandomUtility.randomInteger(-1, 1);
                f.y = d.yOffset + arcademics.RandomUtility.randomInteger(-2, 2);
                f.y0 = f.y;
                f.y1 = f.y + arcademics.RandomUtility.randomInteger(-1, 1);
                this.addChild(f);
                c.push(f)
            }
    (new jk.Tween(null,{
        loop: !0
    })).call(function() {
        for (var a = 0; a < c.length; a++) {
            var b = c[a];
            b.x = b.x0;
            b.y = b.y0
        }
    }, 1E3 / 30 * 5).call(function() {
        for (var a = 0; a < c.length; a++) {
            var b = c[a];
            b.x = b.x1;
            b.y = b.y1
        }
    }, 1E3 / 30 * 5)
}
;
$jscomp.inherits(arcademics.OvalRaceCrowd, jk.Container);
arcademics.OvalRaceCrowd.getUID = jk.Container.getUID;
arcademics.OvalRaceCrowd._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.OvalRaceGame = function() {
    arcademics.GameBase.call(this);
    this.numberFinished = 0;
    var a = new jk.Rect(0,0,arcademics.Settings.gameWidth,arcademics.Settings.gameHeight,{
        fill: arcademics.Settings.getOption("backgroundColor", "#000000")
    });
    this.addChild(a);
    this.race = new (arcademics.Settings.getOption("trackClass", arcademics.OvalRaceTrack))(this);
    this.addChild(this.race);
    a = new arcademics.PlayerArea;
    a.playerColor = this.myPlayer.color;
    a.playerName = this.myPlayer.name;
    a.x = 120;
    a.y = 294;
    this.playerArea = this.addChild(a);
    this.questionArea = a.questionArea;
    this.questionArea.addEventListener(arcademics.GenericEvent.ANSWER, this.onSelectAnswer.bind(this));
    this.powerUpSprite = a.powerUpSprite;
    this.powerUpSprite.addEventListener(arcademics.GenericEvent.BOOSTER, this.onBooster.bind(this));
    this.powerUpSprite.addEventListener(arcademics.GenericEvent.LIGHTNING, this.onLightning.bind(this));
    this.race.initializePlayers(this.players, this.playerId);
    a = new (arcademics.Settings.getOption("mapClass", arcademics.OvalRaceMap))(this.race);
    a.x = 700 - a.width - 16;
    a.y = 12;
    this.map = this.addChild(a);
    jk.Keyboard.addEventListener(jk.KeyboardEvent.KEY_DOWN, this.onKeyDown.bind(this))
}
;
$jscomp.inherits(arcademics.OvalRaceGame, arcademics.GameBase);
arcademics.OvalRaceGame.getUID = arcademics.GameBase.getUID;
arcademics.OvalRaceGame._nextUID = arcademics.GameBase._nextUID;
arcademics.OvalRaceGame.prototype.showPostGameMessage = function() {
    this.postGameTimer.reset();
    this.postGameTimer.start()
}
;
arcademics.OvalRaceGame.prototype.showPreGameCountdown = function() {
    this.preGameTimer.reset();
    this.preGameTimer.start();
    jk.Sound.play("fanfare")
}
;
arcademics.OvalRaceGame.prototype.startGame = function() {
    arcademics.GameBase.prototype.startGame.call(this);
    var a = arcademics.Settings.getOption("startingBellSound", "bell");
    jk.Sound.play(a);
    this.contentManager.reset();
    this.nextQuestion()
}
;
arcademics.OvalRaceGame.prototype.nextQuestion = function() {
    var a = this.contentManager.nextItem();
    this.questionArea.questionNum = this.contentManager.index + 1;
    this.questionArea.question = this.formatQuestion(a.question);
    this.questionArea.answers = a.answers.slice(0, 4);
    this.released = !0;
    this.displayTime = getTimer()
}
;
arcademics.OvalRaceGame.prototype.formatQuestion = function(a) {
    return a
}
;
arcademics.OvalRaceGame.prototype.checkQuestion = function(a) {
    if (!this.stopped && this.released) {
        var b = this.contentManager.item;
        if (b.correctAnswer == a) {
            this.hits++;
            this.hit();
            this.multiClient.sendRoomMessage({
                hit: this.playerId
            });
            var c = getTimer() - this.displayTime;
            a = new arcademics.Response(b.question,b.correctAnswer,a,!0,c);
            this.responses.push(a);
            arcademics.Settings.powerUpPoints++;
            this.powerUpSprite.points = arcademics.Settings.powerUpPoints;
            this.released = !1;
            this.hitTimer.reset();
            this.hitTimer.start()
        } else
            this.misses++,
            this.miss(),
            this.multiClient.sendRoomMessage({
                miss: this.playerId
            }),
            c = getTimer() - this.displayTime,
            a = new arcademics.Response(b.question,b.correctAnswer,a,!1,c),
            this.responses.push(a),
            this.questionArea.showOnly(b.correctAnswer),
            this.released = !1,
            this.missTimer.reset(),
            this.missTimer.start()
    }
}
;
arcademics.OvalRaceGame.prototype.onSelectAnswer = function(a) {
    this.checkQuestion(a.params.answer)
}
;
arcademics.OvalRaceGame.prototype.onBooster = function(a) {
    this.usePowerUp("booster")
}
;
arcademics.OvalRaceGame.prototype.onLightning = function(a) {
    this.usePowerUp("lightning")
}
;
arcademics.OvalRaceGame.prototype.onKeyDown = function(a) {
    switch (a.key) {
    case "1":
        this.checkQuestion(this.questionArea.answers[0]);
        break;
    case "2":
        this.checkQuestion(this.questionArea.answers[1]);
        break;
    case "3":
        this.checkQuestion(this.questionArea.answers[2]);
        break;
    case "4":
        this.checkQuestion(this.questionArea.answers[3]);
        break;
    case "5":
        this.usePowerUp("booster");
        break;
    case "6":
        this.usePowerUp("lightning")
    }
}
;
arcademics.OvalRaceGame.prototype.playerBooster = function(a) {
    a = this.race.racers[a];
    a.score += 1;
    a.hit();
    a.booster()
}
;
arcademics.OvalRaceGame.prototype.playerHit = function(a) {
    a = this.race.racers[a];
    a.score += 1;
    a.hit()
}
;
arcademics.OvalRaceGame.prototype.playerLightning = function(a) {
    var b = this.race.racers[a];
    b.score += 1;
    b.hit();
    b.lightning();
    for (var c = 0; 12 > c; c++)
        c != a && (b = this.race.racers[c],
        b.score -= Math.max(-10, b.score - 3),
        b.miss(),
        b.lightningSlow())
}
;
arcademics.OvalRaceGame.prototype.playerMiss = function(a) {
    a = this.race.racers[a];
    a.score = Math.max(-10, a.score - 3);
    a.miss()
}
;
arcademics.OvalRaceGame.prototype.removedFromStage = function(a) {
    arcademics.GameBase.prototype.removedFromStage.call(this, a);
    jk.Keyboard.removeAllEventListeners()
}
;
arcademics.OvalRaceGame.prototype.update = function(a) {
    arcademics.GameBase.prototype.update.call(this, a);
    if (this.started) {
        this.race.update(a);
        this.map.update();
        for (a = 0; a < this.players.length; a++)
            this.race.hasRacerFinished(a) && !this.players[a].finished && (this.playerFinish(a),
            1 == this.numberFinished && this.race.getRacer(a).winner());
        !this.stopped && !this.doOnce && this.numberFinished >= this.players.length && (this.doOnce = !0,
        this.resultsMessageTimer.delay = 500 * this.playerId,
        this.resultsMessageTimer.start())
    }
}
;
arcademics.OvalRaceGame.prototype.playerFinish = function(a) {
    this.players[a].finished || (a == this.playerId && (this.finishTime = this.time,
    this.released = !1,
    this.hitTimer.stop(),
    this.missTimer.stop(),
    jk.Sound.play("cheer")),
    this.numberFinished++,
    this.players[a].finished = !0,
    this.players[a].score = this.elapsedTime,
    this.players[a].timer = void 0)
}
;
arcademics.OvalRaceGame.prototype.resultsMessageTimer_timerComplete = function(a) {
    a = [];
    for (var b = 0; b < this.players.length; b++)
        a[b] = this.players[b].score;
    this.multiClient.sendRoomMessage({
        stopGame: a
    })
}
;
this.arcademics = this.arcademics || {};
arcademics.OvalRaceMap = function(a, b, c) {
    b = void 0 === b ? 125 : b;
    c = void 0 === c ? 50 : c;
    jk.Container.call(this);
    this.race = a;
    this._width = b;
    this._height = c;
    b = this.outsidePoints;
    c = this.insidePoints;
    var d = "M " + b[0][0] + " " + b[0][1];
    for (a = 1; a < b.length; a++)
        d += " L " + b[a][0] + " " + b[a][1];
    d += " Z M " + c[0][0] + " " + c[0][1];
    for (a = 1; a < c.length; a++)
        d += " L " + c[a][0] + " " + c[a][1];
    a = new jk.Path(d + " Z",{
        fill: "#888888",
        "fill-rule": "evenodd"
    });
    this.addChild(a);
    a = this.startLinePoints;
    a = new jk.Rect(a[0],a[1],a[2],a[3],{
        fill: "#FFFFFF"
    });
    this.addChild(a);
    this.markers = [];
    for (a = 0; a < this.race.racers.length; a++)
        b = new jk.Ellipse(0,0,4,4,{
            fill: this.race.racers[a].color
        }),
        this.markers.push(this.addChild(b));
    this.update()
}
;
$jscomp.inherits(arcademics.OvalRaceMap, jk.Container);
arcademics.OvalRaceMap.getUID = jk.Container.getUID;
arcademics.OvalRaceMap._nextUID = jk.Container._nextUID;
arcademics.OvalRaceMap.prototype.update = function() {
    for (var a = 0; a < this.race.racers.length; a++) {
        var b = this.race.racers[a]
          , c = b.y * this.scale + (this.height - this.trackHeight) / 2;
        this.markers[a].x = b.x * this.scale + (this.width - this.trackWidth) / 2;
        this.markers[a].y = c
    }
}
;
$jscomp.global.Object.defineProperties(arcademics.OvalRaceMap.prototype, {
    insidePoints: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return arcademics.Utility.getArc(this.centerX - this.trackWidth / 3, this.centerY, this.trackHeight / 4, this.trackHeight / 4, Math.PI / 2, 3 * Math.PI / 2, 20).concat(arcademics.Utility.getArc(this.centerX + this.trackWidth / 3, this.centerY, this.trackHeight / 4, this.trackHeight / 4, 3 * Math.PI / 2, 5 * Math.PI / 2, 20))
        }
    },
    outsidePoints: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return arcademics.Utility.getArc(this.centerX - this.trackWidth / 3, this.centerY, this.trackHeight / 2, this.trackHeight / 2, Math.PI / 2, 3 * Math.PI / 2, 20).concat(arcademics.Utility.getArc(this.centerX + this.trackWidth / 3, this.centerY, this.trackHeight / 2, this.trackHeight / 2, 3 * Math.PI / 2, 5 * Math.PI / 2, 20))
        }
    },
    scale: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.trackHeight / 1200
        }
    },
    startLinePoints: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return [this.centerX + (600 + this.race.getStartLinePosition() - 1800 - 50) * this.trackHeight / 1200, this.centerY - this.trackHeight / 2, 2, this.trackThickness]
        }
    },
    trackHeight: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Math.min(this.height, this.width / 3)
        }
    },
    trackWidth: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return Math.min(this.width, 3 * this.height)
        }
    },
    trackThickness: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.trackHeight / 4
        }
    },
    centerX: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.width / 2
        }
    },
    centerY: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.height / 2
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.OvalRaceRacer = function() {
    jk.Container.call(this);
    this._color;
    this.boosterClip1;
    this.boosterClip2;
    this.lastRacerId;
    Array.isArray(arcademics.Settings.boosterProps) || this.addEventListener(jk.Event.ENTER_FRAME, this.enterFrame.bind(this))
}
;
$jscomp.inherits(arcademics.OvalRaceRacer, jk.Container);
arcademics.OvalRaceRacer.getUID = jk.Container.getUID;
arcademics.OvalRaceRacer._nextUID = jk.Container._nextUID;
arcademics.OvalRaceRacer.prototype.booster = function() {
    var a = this;
    if (!arcademics.Settings.isAffiliate) {
        var b = arcademics.Settings.boosterProps;
        Array.isArray(arcademics.Settings.boosterProps) || (b = arcademics.Settings.boosterProps[this.dolphin.id]);
        this.boosterClip1 && (this.removeChild(this.boosterClip1),
        this.removeChild(this.boosterClip2),
        this.boosterClip2 = this.boosterClip1 = null);
        var c = new arcademics.Booster;
        c.rotation = b[4];
        c.scaleX = b[2];
        c.scaleY = b[3];
        c.x = b[0];
        c.y = b[1];
        c.play();
        this.boosterClip1 = this.addChild(c);
        c = new arcademics.Booster;
        c.rotation = b[9];
        c.scaleX = b[7];
        c.scaleY = b[8];
        c.x = b[5];
        c.y = b[6];
        c.play();
        this.boosterClip2 = this.addChild(c);
        setTimeout(function() {
            a.boosterClip1 && (a.removeChild(a.boosterClip1),
            a.removeChild(a.boosterClip2),
            a.boosterClip1 = null,
            a.boosterClip2 = null)
        }, arcademics.Settings.boosterDuration)
    }
}
;
arcademics.OvalRaceRacer.prototype.hit = function() {}
;
arcademics.OvalRaceRacer.prototype.lightning = function() {
    var a = this;
    if (!arcademics.Settings.isAffiliate) {
        var b = arcademics.Settings.lightningProps
          , c = new arcademics.Lightning;
        c.rotation = b[4];
        c.scaleX = b[2];
        c.scaleY = b[3];
        c.x = b[0];
        c.y = b[1];
        c.play();
        this.addChild(c);
        setTimeout(function() {
            a.contains(c) && a.removeChild(c)
        }, arcademics.Settings.lightningDuration)
    }
}
;
arcademics.OvalRaceRacer.prototype.lightningSlow = function() {
    var a = this;
    if (!arcademics.Settings.isAffiliate) {
        var b = arcademics.Settings.lightningStrikeProps
          , c = new arcademics.LightningStrike;
        c.rotation = -this.rotation;
        c.x = b[0];
        c.y = b[1];
        this.addChild(c);
        b = arcademics.Settings.lightningStunProps;
        var d = new arcademics.LightningStun;
        d.scaleX = b[2];
        d.scaleY = b[3];
        d.x = b[0];
        d.y = b[1];
        this.addChild(d);
        setTimeout(function() {
            a.contains(c) && a.removeChild(c)
        }, arcademics.Settings.lightningDuration / 4);
        setTimeout(function() {
            a.contains(d) && a.removeChild(d)
        }, arcademics.Settings.lightningDuration)
    }
}
;
arcademics.OvalRaceRacer.prototype.miss = function() {}
;
arcademics.OvalRaceRacer.prototype.enterFrame = function(a) {
    this.lastRacerId != this.dolphin.id && this.boosterClip1 && arcademics.Settings.boosterProps[this.dolphin.id] && (a = arcademics.Settings.boosterProps[this.dolphin.id],
    this.boosterClip1.rotation = a[4],
    this.boosterClip1.scaleX = a[2],
    this.boosterClip1.scaleY = a[3],
    this.boosterClip1.x = a[0],
    this.boosterClip1.y = a[1],
    this.boosterClip2.rotation = a[9],
    this.boosterClip2.scaleX = a[7],
    this.boosterClip2.scaleY = a[8],
    this.boosterClip2.x = a[5],
    this.boosterClip2.y = a[6]);
    this.lastRacerId = this.dolphin.id
}
;
arcademics.OvalRaceRacer.prototype.update = function() {}
;
arcademics.OvalRaceRacer.prototype.winner = function() {
    this._calcInitDimensions();
    var a = new arcademics.WinnerClip;
    a.rotation = -this.rotation;
    a.scaleX = .6;
    a.scaleY = .6;
    a.x = -this.width / 2;
    this.addChild(a)
}
;
arcademics.OvalRaceRacer.prototype.glow = function() {
    this.filters = [new jk.GlowFilter("#FFFFFF",.8,10,10,3)]
}
;
arcademics.OvalRaceRacer.prototype.onStartMoving = function() {}
;
arcademics.OvalRaceRacer.prototype.leaveTracks = function() {
    return !1
}
;
$jscomp.global.Object.defineProperties(arcademics.OvalRaceRacer.prototype, {
    fast: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return !1
        }
    },
    slow: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return !1
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.OvalRaceSpectator = function() {
    jk.Container.call(this);
    var a = arcademics.ColorUtility.hsvToColor({
        H: Math.floor(360 * Math.random()),
        S: .5 + .5 * Math.random(),
        V: .9
    });
    a = new jk.Rect(0,0,44,18,5,5,{
        fill: a,
        stroke: "#000000"
    });
    this.addChild(a);
    a = arcademics.ColorUtility.hsvToColor({
        H: Math.floor(60 * Math.random()),
        S: .25 + .5 * Math.random(),
        V: .8
    });
    a = new jk.Ellipse(22,10,12,15,{
        fill: new jk.Gradient(jk.Gradient.RADIAL,["#F9F3E6", a],[1, 1],[0, 1]),
        stroke: "#000000"
    });
    this.addChild(a)
}
;
$jscomp.inherits(arcademics.OvalRaceSpectator, jk.Container);
arcademics.OvalRaceSpectator.getUID = jk.Container.getUID;
arcademics.OvalRaceSpectator._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.OvalRaceSpreadEngine = function(a, b, c) {
    this.groupScoreCoefficient = 0;
    this.raceLength = a;
    this.averageTime = b;
    this.minSpread = 4 * this.baseSpeed;
    this.maxSpread = 6 * this.baseSpeed;
    this.fullSpreadTime = this.averageTime / 3;
    this.playerScores = [];
    for (a = 0; a < c; a++)
        this.playerScores[a] = 0
}
;
arcademics.OvalRaceSpreadEngine.prototype.setPlayerScore = function(a, b) {
    this.playerScores[a] = b
}
;
arcademics.OvalRaceSpreadEngine.prototype.getTargetPositions = function(a) {
    for (var b = this.minSpread + (this.maxSpread - this.minSpread) * Math.min(1, a / this.fullSpreadTime), c = Number.MAX_VALUE, d = Number.MIN_VALUE, e = 0, f = 0; f < this.playerScores.length; f++) {
        var g = this.playerScores[f];
        c = Math.min(g, c);
        d = Math.max(g, d);
        e += g
    }
    var h = [];
    a = this.baseSpeed * a / 1E3 + this.groupScoreCoefficient * e;
    for (f = 0; f < this.playerScores.length; f++)
        g = this.playerScores[f],
        h[f] = ((g - c) / (d - c) - .5) * b + a;
    return h
}
;
$jscomp.global.Object.defineProperties(arcademics.OvalRaceSpreadEngine.prototype, {
    baseSpeed: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.raceLength / this.averageTime
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.OvalRaceTrack = function(a) {
    jk.Container.call(this);
    this.AVERAGE_TIME = 60;
    this.ZOOM_OUT_SCALE = .6;
    this.STRAIGHT_AWAY = 2400;
    this.ARC_LENGTH = 450 * Math.PI;
    this.TRACK_LENGTH = 2 * (this.ARC_LENGTH + this.STRAIGHT_AWAY);
    this.TRACK_WIDTH = 300;
    this.START_LINE = 1650;
    this.FINISH_LINE = this.START_LINE + this.TRACK_LENGTH;
    this.game = a;
    this.racers = [];
    this.trackClip || (this.trackClip = new jk.Container,
    a = new jk.SVG(arcademics.Settings.gamePrefix + "Track"),
    this.trackClip.addChild(a));
    this.addChild(this.trackClip);
    this.tracksClip = new jk.Container;
    this.trackClip.addChild(this.tracksClip);
    this.finishLineClip = new jk.SVG(arcademics.Settings.gamePrefix + "FinishLine");
    this.finishLineClip.x = 2250;
    this.finishLineClip.y = -55;
    this.update()
}
;
$jscomp.inherits(arcademics.OvalRaceTrack, jk.Container);
arcademics.OvalRaceTrack.getUID = jk.Container.getUID;
arcademics.OvalRaceTrack._nextUID = jk.Container._nextUID;
arcademics.OvalRaceTrack.prototype.initializePlayers = function(a, b) {
    var c = new arcademics.OvalRaceCrowd;
    c.x = 1396;
    c.y = -100;
    this.trackClip.addChild(c);
    c = new arcademics.OvalRaceCrowd;
    c.scaleX = -1;
    c.x = 2920;
    c.y = -100;
    this.trackClip.addChild(c);
    this.raceStarted = !1;
    this.spreadEngine = new arcademics.OvalRaceSpreadEngine(this.TRACK_LENGTH,this.AVERAGE_TIME,a.length);
    this.followIndex = b;
    for (this.trackClip.removeChild(this.finishLineClip); this.racers.length; )
        this.trackClip.removeChild(this.racers.pop());
    for (c = 0; c < a.length; c++) {
        var d = new (arcademics.Settings.requireOption("racerClass"));
        this.trackClip.addChild(d);
        d.scaleX = d.scaleY = arcademics.Settings.getOption("racerScale", 1);
        d.theta = this.START_LINE - 200 - d.width / 2 - c % 2 * 120;
        d.r = (this.TRACK_WIDTH - d.height) / (a.length / 2) * (c - c % 2) / 2 + 25;
        d.score = 0;
        this.racers.push(d);
        c == b && d.glow();
        d.color = a[c].color;
        d.update()
    }
    this.trackClip.addChild(this.finishLineClip);
    this.update()
}
;
arcademics.OvalRaceTrack.prototype.update = function(a) {
    var b = this, c;
    if (this.game.started) {
        if (!this.raceStarted) {
            for (c = 0; c < this.racers.length; c++) {
                var d = this.racers[c];
                d.onStartMoving()
            }
            this.raceStarted = !0
        }
        for (c = 0; c < this.racers.length; c++)
            this.spreadEngine.setPlayerScore(c, this.racers[c].score);
        var e = this.spreadEngine.getTargetPositions(this.game.elapsedTime)
          , f = this.spreadEngine.baseSpeed * a / 1E3;
        for (c = 0; c < this.racers.length; c++) {
            d = this.racers[c];
            var g = this.START_LINE + e[c];
            d.theta < this.FINISH_LINE ? (d.theta += f * (1 - .2 * Math.cos(2 * c * Math.PI / this.racers.length + this.game.elapsedTime / 1E3)),
            d.fast && (d.theta += f / 2),
            d.slow && (d.theta -= f / 2),
            5 < d.theta - g ? d.theta -= f / 4 * Math.min(1, (d.theta - g - 5) / 40) : 5 < g - d.theta && (d.theta += f / 4 * Math.min(1, (g - d.theta - 5) / 40))) : d.theta += Math.max(0, this.FINISH_LINE + 400 + c % 2 * 120 - d.theta) / 5 * a / 1E3;
            g = this.getCoords(d.theta, d.r);
            d.x = g[0];
            d.y = g[1];
            d.targetRotation = 180 * g[2] / Math.PI;
            g = arcademics.Settings.getOption("tracksDuration");
            var h = arcademics.Settings.getOption("tracksTo", {
                alpha: 0
            })
              , k = arcademics.Settings.getOption("tracksOffset", 0)
              , l = arcademics.Settings.getOption("multipleTracks");
            if (g && d.leaveTracks() && (l || null == m)) {
                var m = new jk.SVG(arcademics.Settings.gamePrefix + "Tracks");
                m.rotation = d.rotation;
                m.x = d.x + Math.cos(d.rotation * Math.PI / 180) * k;
                m.y = d.y + Math.sin(d.rotation * Math.PI / 180) * k;
                this.tracksClip.addChild(m);
                (new jk.Tween(m)).to(h, g).call(function() {
                    b.tracksClip.removeChild(b)
                })
            }
        }
        a = 1;
        this.racers[this.followIndex].theta >= this.FINISH_LINE && (a = this.ZOOM_OUT_SCALE);
        this.trackClip.scaleX = this.trackClip.scaleY = arcademics.Utility.easeToLinearly(this.trackClip.scaleX, a, .03);
        this.centerScreenOnRacer(this.racers[this.followIndex]);
        for (c = 0; c < this.racers.length; c++)
            d = this.racers[c],
            g = this.getTargetR(d),
            d.targetRotation -= Math.min(15, Math.max(-15, (g - d.r) / 2)),
            d.targetRotation = (d.targetRotation % 360 + 360) % 360,
            d.rotation = (d.rotation % 360 + 360) % 360,
            180 < Math.abs(d.targetRotation - d.rotation) && (d.targetRotation = d.rotation < d.targetRotation ? d.targetRotation - 360 : d.targetRotation + 360),
            d.r = arcademics.Utility.snapNumber(d.r + (g > d.r ? 3 : -3), g, 4),
            d.rotation = arcademics.Utility.snapNumber(d.rotation + (d.targetRotation > d.rotation ? 4 : -4), d.targetRotation, 5),
            d.update()
    } else {
        this.trackClip.scaleX = this.trackClip.scaleY = this.ZOOM_OUT_SCALE;
        for (c = 0; c < this.racers.length; c++)
            d = this.racers[c],
            g = this.getCoords(d.theta, d.r),
            d.x = g[0],
            d.y = g[1],
            d.targetRotation = 180 * g[2] / Math.PI;
        this.centerScreenOnRacer(this.racers[this.followIndex])
    }
}
;
arcademics.OvalRaceTrack.prototype.centerScreenOnRacer = function(a) {
    if (a) {
        var b = this.game.playerArea.y;
        a = this.getCoords(a.theta, b / 2);
        this.trackClip.x = 350 - a[0] * this.trackClip.scaleX;
        this.trackClip.y = 200 - a[1] * this.trackClip.scaleY - (400 - b) / 2
    }
}
;
arcademics.OvalRaceTrack.prototype.getTargetR = function(a) {
    for (var b = arcademics.Settings.getOption("racerWidth", 25), c = arcademics.Settings.getOption("racerLength", 110), d = b / 2 + 5, e = 0; e < this.racers.length; e++) {
        var f = this.racers[e];
        a != f && Math.abs(a.theta - f.theta) < c && (f.r < a.r || f.r == a.r && a.theta < f.theta) && (d = Math.max(d, f.r + b))
    }
    return Math.min(this.TRACK_WIDTH - b / 2, d)
}
;
arcademics.OvalRaceTrack.prototype.getCoords = function(a, b) {
    b = void 0 === b ? 0 : b;
    a %= this.TRACK_LENGTH;
    if (a < this.STRAIGHT_AWAY)
        return [600 + a, 300 - b, 0];
    if (a < this.STRAIGHT_AWAY + this.ARC_LENGTH)
        return a = (a - this.STRAIGHT_AWAY) / 450,
        [3E3 + (300 + b) * Math.sin(a), 600 - (300 + b) * Math.cos(a), a];
    if (a < 2 * this.STRAIGHT_AWAY + this.ARC_LENGTH)
        return a -= this.STRAIGHT_AWAY + this.ARC_LENGTH,
        [3E3 - a, 900 + b, Math.PI];
    a = (a - 2 * this.STRAIGHT_AWAY - this.ARC_LENGTH) / 450;
    return [600 - (300 + b) * Math.sin(a), 600 + (300 + b) * Math.cos(a), Math.PI + a]
}
;
arcademics.OvalRaceTrack.prototype.getRacer = function(a) {
    return this.racers[a]
}
;
arcademics.OvalRaceTrack.prototype.getStartLinePosition = function() {
    return this.START_LINE
}
;
arcademics.OvalRaceTrack.prototype.hasRacerFinished = function(a) {
    return this.racers[a].theta >= this.FINISH_LINE
}
;
this.arcademics = this.arcademics || {};
arcademics.DuckyRaceGame = function() {
    arcademics.OvalRaceGame.call(this);
    this.compMaxRate = 27;
    this.compMinRate = 12;
    this.showPreGameCountdown()
}
;
$jscomp.inherits(arcademics.DuckyRaceGame, arcademics.OvalRaceGame);
arcademics.DuckyRaceGame.getUID = arcademics.OvalRaceGame.getUID;
arcademics.DuckyRaceGame._nextUID = arcademics.OvalRaceGame._nextUID;
arcademics.DuckyRaceGame.generateStartMessage = function() {
    var a = arcademics.SubtractionGenerator.generateItems(1, 12);
    a = new arcademics.ContentManager(a,arcademics.ContentManager.PARTIAL_SHUFFLE);
    a.select(0, 1, 60);
    return {
        start: 1,
        content: a.toArray()
    }
}
;
arcademics.DuckyRaceGame.prototype.formatQuestion = function(a) {
    return a.split("-").join(" - ")
}
;
arcademics.DuckyRaceGame.prototype.hit = function() {
    jk.Sound.play("chime");
    var a = arcademics.RandomUtility.getRandomElement(["duck_right1", "duck_right2"]);
    jk.Sound.play(a)
}
;
arcademics.DuckyRaceGame.prototype.miss = function() {
    jk.Sound.play("buzz");
    jk.Sound.play("duck_wrong")
}
;
arcademics.DuckyRaceGame.prototype.startGame = function() {
    arcademics.OvalRaceGame.prototype.startGame.call(this);
    jk.Sound.play("waves2", !0)
}
;
this.arcademics = this.arcademics || {};
arcademics.DuckyRaceRacer = function() {
    arcademics.OvalRaceRacer.call(this);
    this.parts = ["head"];
    this.rotationParts = ["head"];
    this.normalAnimation = {
        reps: 0,
        rate: 1 / 3,
        parts: {
            head: [3, 3, 0, 0, 3]
        }
    };
    this.slowAnimation = {
        reps: 1,
        rate: .2,
        parts: {
            head: [3, 0, 3]
        },
        rotationParts: {
            head: [15, -15, 0]
        }
    };
    this.fastAnimation = {
        reps: 6,
        rate: 1 / 3,
        parts: {
            head: [0, 3]
        }
    };
    this.stopAnimation = {
        reps: 0,
        rate: 1 / 3,
        parts: {
            head: [0]
        }
    };
    var a = new jk.SVG("DuckyRaceBody");
    a.x = -56;
    a.y = -19;
    this.body = this.addChild(a);
    a = new jk.SVG("DuckyRaceHead");
    a.x = -35;
    a.y = -15;
    this.head = this.addChild(a);
    this.animation = this.stopAnimation;
    this.nextAnimation = null;
    for (a = this.rep = this.frame = 0; a < this.parts.length; a++) {
        var b = this.parts[a];
        this[b].origin = this[b].x;
        this[b].rotation0 = this[b].rotation
    }
}
;
$jscomp.inherits(arcademics.DuckyRaceRacer, arcademics.OvalRaceRacer);
arcademics.DuckyRaceRacer.getUID = arcademics.OvalRaceRacer.getUID;
arcademics.DuckyRaceRacer._nextUID = arcademics.OvalRaceRacer._nextUID;
arcademics.DuckyRaceRacer.prototype.onStartMoving = function() {
    this.animation = this.normalAnimation
}
;
arcademics.DuckyRaceRacer.prototype.miss = function() {
    this.nextAnimation = this.slowAnimation
}
;
arcademics.DuckyRaceRacer.prototype.hit = function() {
    this.nextAnimation = this.fastAnimation
}
;
arcademics.DuckyRaceRacer.prototype.update = function() {
    var a = 0, b;
    for (b in this.animation.parts)
        a = Math.max(a, this.animation.parts[b].length),
        this[b].x = this[b].origin + this.animation.parts[b][Math.floor(this.frame)];
    for (b in this.animation.rotationParts)
        a = Math.max(a, this.animation.rotationParts[b].length),
        this[b].rotation = this[b].rotation0 + this.animation.rotationParts[b][Math.floor(this.frame)];
    this.frame += this.animation.rate;
    this.frame >= a && (this.frame = 0,
    this.nextAnimation ? (this.animation = this.nextAnimation,
    this.nextAnimation = null,
    this.rep = 0) : (this.rep++,
    0 < this.animation.reps && this.rep >= this.animation.reps && (this.animation = this.normalAnimation)))
}
;
arcademics.DuckyRaceRacer.prototype.leaveTracks = function() {
    return 0 == this.frame
}
;
$jscomp.global.Object.defineProperties(arcademics.DuckyRaceRacer.prototype, {
    color: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._color
        },
        set: function(a) {
            this._color = a;
            this.body.color = a;
            this.head.color = a
        }
    },
    fast: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.animation == this.fastAnimation
        }
    },
    slow: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.animation == this.slowAnimation
        }
    }
});
this.arcademics = this.arcademics || {};
var ADD_ROOM = "AR"
  , ADD_USER = "AU"
  , CREATE_OR_JOIN_ROOM = "COJR"
  , CREATE_OR_JOIN_ROOM_2 = "COJR2"
  , CREATE_ROOM = "CR"
  , JOIN_ROOM = "JR"
  , LEAVE_ROOM = "LR"
  , LOGIN = "LI"
  , LOGOUT = "LO"
  , PING = "PI"
  , REMOVE_ROOM = "RR"
  , REMOVE_USER = "RU"
  , ROOM_MESSAGE = "RM"
  , ROOM_VARIABLES = "RV"
  , SERVER_INFO = "INFO"
  , SERVER_RELOAD = "RELOAD"
  , SERVER_STATUS = "STAT"
  , SERVER_STOP = "STOP"
  , SESSION_TIMEOUT = "ST"
  , UPDATE_ROOM = "UR"
  , USER_VARIABLES = "UV";
arcademics.MultiClient = function(a) {
    jk.EventDispatcher.call(this);
    this.debug = a;
    this.errorMap = {
        OK: "OK",
        UA: "User name already exists.",
        UI: "User name is inappropriate.",
        UL: "User is not logged in.",
        UR: "User is not in a room.",
        RA: "Room name already exists.",
        RI: "Room password is inappropriate.",
        RD: "Room does not exist.",
        RP: "Room password is invalid.",
        RO: "Room is not open.",
        RF: "Room is full."
    };
    this.ws = this.pendingUserData = this.myUser = this.myRoom = this.myZone = null
}
;
$jscomp.inherits(arcademics.MultiClient, jk.EventDispatcher);
arcademics.MultiClient.prototype.close = function() {
    this.myUser = this.myRoom = this.myZone = null;
    this.ws.close()
}
;
arcademics.MultiClient.prototype.connect = function(a) {
    window.WebSocket && (a = new WebSocket(a),
    a.onclose = function(a) {
        this.debug && console.log("WebSocket close " + a.code + " " + a.reason + " " + a.wasClean);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.CLOSE,{}))
    }
    .bind(this),
    a.onerror = function() {
        this.debug && console.log("WebSocket error");
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.ERROR,{}))
    }
    .bind(this),
    a.onmessage = function(a) {
        this.debug && console.log("WebSocket message " + a.data);
        this.processData(a.data)
    }
    .bind(this),
    a.onopen = function() {
        this.debug && console.log("WebSocket open");
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.CONNECT,{}))
    }
    .bind(this),
    this.ws = a)
}
;
arcademics.MultiClient.prototype.createOrJoinRoom = function(a, b) {
    this.connected ? this.send([CREATE_OR_JOIN_ROOM, a, b]) : this.processData(JSON.stringify([CREATE_ROOM, "OK", [a, b, 1, 0, [[this.myUser.name, this.myUser.variables]]]]))
}
;
arcademics.MultiClient.prototype.createOrJoinRoom2 = function(a, b, c) {
    this.connected ? this.send([CREATE_OR_JOIN_ROOM_2, a, b, c]) : this.processData(JSON.stringify([CREATE_ROOM, "OK", [a, c, 1, 0, [[this.myUser.name, this.myUser.variables]]]]))
}
;
arcademics.MultiClient.prototype.createRoom = function(a, b, c) {
    this.connected ? this.send([CREATE_ROOM, a, b, c]) : this.processData(JSON.stringify([CREATE_ROOM, "OK", [a, c, 1, "" == b ? 0 : 1, [[this.myUser.name, this.myUser.variables]]]]))
}
;
arcademics.MultiClient.prototype.joinRoom = function(a, b) {
    this.connected ? this.send([JOIN_ROOM, a, b]) : console.log("MultiClient.joinRoom is not available in offline mode.")
}
;
arcademics.MultiClient.prototype.leaveRoom = function() {
    this.connected ? this.send([LEAVE_ROOM]) : this.processData(JSON.stringify([LEAVE_ROOM, "OK", [this.myZone.name, []]]))
}
;
arcademics.MultiClient.prototype.login = function(a, b) {
    this.pendingUserData = [a, {}];
    this.connected ? this.send([LOGIN, a, b]) : this.processData(JSON.stringify([LOGIN, "OK", [b, []]]))
}
;
arcademics.MultiClient.prototype.logout = function() {
    this.connected ? this.send([LOGOUT]) : this.processData(JSON.stringify([LOGOUT, "OK"]))
}
;
arcademics.MultiClient.prototype.sendRoomMessage = function(a) {
    this.connected && 1 < this.myRoom.users.length ? this.send([ROOM_MESSAGE, a]) : this.processData(JSON.stringify([ROOM_MESSAGE, "OK", [this.myUser.name, a]]))
}
;
arcademics.MultiClient.prototype.sendRoomVariables = function(a) {
    this.connected ? this.send([ROOM_VARIABLES, a]) : this.processData(JSON.stringify([ROOM_VARIABLES, "OK", [this.myUser.name, a]]))
}
;
arcademics.MultiClient.prototype.sendUserVariables = function(a) {
    this.connected ? this.send([USER_VARIABLES, a]) : this.processData(JSON.stringify([USER_VARIABLES, "OK", [this.myUser.name, a]]))
}
;
arcademics.MultiClient.prototype.serverInfo = function() {
    this.connected ? this.send([SERVER_INFO]) : console.log("MultiClient.serverInfo is not implemented.")
}
;
arcademics.MultiClient.prototype.serverReload = function(a) {
    this.connected ? this.send([SERVER_RELOAD, a]) : console.log("MultiClient.serverReload is not available in offline mode.")
}
;
arcademics.MultiClient.prototype.serverStatus = function() {
    this.connected ? this.send([SERVER_STATUS]) : console.log("MultiClient.serverStatus is not available in offline mode.")
}
;
arcademics.MultiClient.prototype.serverStop = function(a) {
    this.connected ? this.send([SERVER_STOP, a]) : console.log("MultiClient.serverStop is not available in offline mode.")
}
;
arcademics.MultiClient.prototype.updateRoom = function(a) {
    this.connected ? this.send([UPDATE_ROOM, a]) : console.log("MultiClient.updateRoom is not available in offline mode.")
}
;
arcademics.MultiClient.prototype.processData = function(a) {
    a = JSON.parse(a);
    var b = a[0]
      , c = a[1];
    a = a[2];
    var d = "OK" == c
      , e = this.errorMap[c];
    c = {
        success: d,
        error: e
    };
    d || arcademics.Settings.gaTracker.trackMultiplayerError(e);
    switch (b) {
    case ADD_ROOM:
        c.room = this.myZone.addRoom(a);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.ADD_ROOM,c));
        break;
    case ADD_USER:
        c.user = this.myRoom.addUser(a);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.ADD_USER,c));
        break;
    case CREATE_ROOM:
        d && (this.myRoom = new arcademics.Room(a));
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.CREATE_ROOM,c));
        break;
    case JOIN_ROOM:
        d && (this.myRoom = new arcademics.Room(a));
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.JOIN_ROOM,c));
        break;
    case LEAVE_ROOM:
        this.myZone = new arcademics.Zone(a);
        this.myRoom = null;
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.LEAVE_ROOM,c));
        break;
    case LOGIN:
        d && (this.myZone = new arcademics.Zone(a),
        this.myUser = new arcademics.User(this.pendingUserData));
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.LOGIN,c));
        break;
    case LOGOUT:
        this.myUser = this.myRoom = this.myZone = null;
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.LOGOUT,c));
        break;
    case REMOVE_ROOM:
        c.room = this.myZone.removeRoom(a);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.REMOVE_ROOM,c));
        break;
    case REMOVE_USER:
        c.user = this.myRoom.removeUser(a);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.REMOVE_USER,c));
        break;
    case ROOM_MESSAGE:
        d && (c.sender = a[0],
        c.message = a[1]);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.ROOM_MESSAGE,c));
        break;
    case ROOM_VARIABLES:
        d && (c.sender = a[0],
        c.variables = a[1],
        this.myRoom.setVariables(a[1]));
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.ROOM_VARIABLES,c));
        break;
    case SERVER_INFO:
        c.info = a;
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.SERVER_INFO,c));
        break;
    case SERVER_RELOAD:
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.SERVER_RELOAD,c));
        break;
    case SERVER_STATUS:
        c.status = a;
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.SERVER_STATUS,c));
        break;
    case SERVER_STOP:
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.SERVER_STOP,c));
        break;
    case SESSION_TIMEOUT:
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.SESSION_TIMEOUT,c));
        break;
    case UPDATE_ROOM:
        b = this.myZone.findRoom(a).isOpen;
        c.room = this.myZone.updateRoom(a);
        !b && c.room.isOpen ? (this.myZone.addRoom(a),
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.ADD_ROOM,c))) : b && !c.room.isOpen ? (this.myZone.removeRoom(a),
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.REMOVE_ROOM,c))) : this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.UPDATE_ROOM,c));
        break;
    case USER_VARIABLES:
        c.sender = a[0];
        c.variables = a[1];
        this.myUser.name == c.sender && this.myUser.setVariables(a[1]);
        b = this.myRoom ? this.myRoom.users : [];
        for (d = 0; d < b.length; d++)
            b[d].name == c.sender && b[d].setVariables(a[1]);
        this.dispatchEvent(new arcademics.MultiClientEvent(arcademics.MultiClientEvent.USER_VARIABLES,c))
    }
}
;
arcademics.MultiClient.prototype.send = function(a) {
    a = JSON.stringify(a);
    this.debug && console.log("WebSocket send " + a);
    this.ws.send(a)
}
;
$jscomp.global.Object.defineProperties(arcademics.MultiClient.prototype, {
    connected: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.ws && 1 == this.ws.readyState
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.MultiClientEvent = function(a, b) {
    jk.Event.call(this, a, null);
    this.params = b
}
;
$jscomp.inherits(arcademics.MultiClientEvent, jk.Event);
arcademics.MultiClientEvent.TIMER_COMPLETE = jk.Event.TIMER_COMPLETE;
arcademics.MultiClientEvent.TIMER = jk.Event.TIMER;
arcademics.MultiClientEvent.TICK = jk.Event.TICK;
arcademics.MultiClientEvent.REMOVED_FROM_STAGE = jk.Event.REMOVED_FROM_STAGE;
arcademics.MultiClientEvent.MOTION_CHANGE = jk.Event.MOTION_CHANGE;
arcademics.MultiClientEvent.INPUT = jk.Event.INPUT;
arcademics.MultiClientEvent.FILE_LOAD = jk.Event.FILE_LOAD;
arcademics.MultiClientEvent.FOCUS = jk.Event.FOCUS;
arcademics.MultiClientEvent.ENTER_FRAME = jk.Event.ENTER_FRAME;
arcademics.MultiClientEvent.COMPLETE = jk.Event.COMPLETE;
arcademics.MultiClientEvent.CHANGE = jk.Event.CHANGE;
arcademics.MultiClientEvent.BLUR = jk.Event.BLUR;
arcademics.MultiClientEvent.ADDED_TO_STAGE = jk.Event.ADDED_TO_STAGE;
arcademics.MultiClientEvent.ADD_ROOM = "ADD_ROOM";
arcademics.MultiClientEvent.ADD_USER = "ADD_USER";
arcademics.MultiClientEvent.CLOSE = "CLOSE";
arcademics.MultiClientEvent.CONNECT = "CONNECT";
arcademics.MultiClientEvent.CREATE_ROOM = "CREATE_ROOM";
arcademics.MultiClientEvent.ERROR = "ERROR";
arcademics.MultiClientEvent.JOIN_ROOM = "JOIN_ROOM";
arcademics.MultiClientEvent.LEAVE_ROOM = "LEAVE_ROOM";
arcademics.MultiClientEvent.LOGIN = "LOGIN";
arcademics.MultiClientEvent.LOGOUT = "LOGOUT";
arcademics.MultiClientEvent.REMOVE_ROOM = "REMOVE_ROOM";
arcademics.MultiClientEvent.REMOVE_USER = "REMOVE_USER";
arcademics.MultiClientEvent.ROOM_MESSAGE = "ROOM_MESSAGE";
arcademics.MultiClientEvent.ROOM_VARIABLES = "ROOM_VARIABLES";
arcademics.MultiClientEvent.SERVER_INFO = "SERVER_INFO";
arcademics.MultiClientEvent.SERVER_RELOAD = "SERVER_RELOAD";
arcademics.MultiClientEvent.SERVER_STATUS = "SERVER_STATUS";
arcademics.MultiClientEvent.SERVER_STOP = "SERVER_STOP";
arcademics.MultiClientEvent.SESSION_TIMEOUT = "SESSION_TIMEOUT";
arcademics.MultiClientEvent.UPDATE_ROOM = "UPDATE_ROOM";
arcademics.MultiClientEvent.USER_VARIABLES = "USER_VARIABLES";
this.arcademics = this.arcademics || {};
arcademics.Room = function(a) {
    this.name = a[0];
    this.maxUsers = a[1];
    this.isOpen = !!a[2];
    this.isPrivate = !!a[3];
    var b = a[4];
    if ("number" == typeof b)
        this.userCount = b;
    else {
        this.users = [];
        for (var c = 0; c < b.length; c++)
            this.users.push(new arcademics.User(b[c]));
        this.variables = a[5]
    }
}
;
arcademics.Room.prototype.addUser = function(a) {
    a = new arcademics.User(a);
    this.users.push(a);
    return a
}
;
arcademics.Room.prototype.removeUser = function(a) {
    a = a[0];
    for (var b, c = 0; c < this.users.length; c++)
        if (this.users[c].name == a) {
            b = this.users[c];
            this.users.splice(c, 1);
            break
        }
    return b
}
;
arcademics.Room.prototype.setVariables = function(a) {
    for (var b in a)
        this.variables[b] = a[b]
}
;
arcademics.Room.prototype.update = function(a) {
    this.name = a[0];
    this.maxUsers = a[1];
    this.isOpen = !!a[2];
    this.isPrivate = !!a[3];
    this.userCount = a[4]
}
;
this.arcademics = this.arcademics || {};
arcademics.User = function(a) {
    this.name = a[0];
    this.variables = a[1]
}
;
arcademics.User.prototype.setVariables = function(a) {
    for (var b in a)
        this.variables[b] = a[b]
}
;
this.arcademics = this.arcademics || {};
arcademics.Zone = function(a) {
    this.name = a[0];
    a = a[1];
    for (var b = [], c = 0; c < a.length; c++)
        b.push(new arcademics.Room(a[c]));
    this.rooms = b
}
;
arcademics.Zone.prototype.addRoom = function(a) {
    a = new arcademics.Room(a);
    this.rooms.push(a);
    return a
}
;
arcademics.Zone.prototype.addUser = function(a) {
    a = new arcademics.User(a);
    this.users.push(a);
    return a
}
;
arcademics.Zone.prototype.findRoom = function(a) {
    a = a[0];
    for (var b = 0; b < this.rooms.length; b++)
        if (this.rooms[b].name == a)
            return this.rooms[b]
}
;
arcademics.Zone.prototype.removeRoom = function(a) {
    a = a[0];
    for (var b, c = 0; c < this.rooms.length; c++)
        if (this.rooms[c].name == a) {
            b = this.rooms[c];
            this.rooms.splice(c, 1);
            break
        }
    return b
}
;
arcademics.Zone.prototype.removeUser = function(a) {
    a = a[0];
    for (var b, c = 0; c < this.users.length; c++)
        if (this.users[c].name == a) {
            b = this.users[c];
            this.users.splice(c, 1);
            break
        }
    return b
}
;
arcademics.Zone.prototype.updateRoom = function(a) {
    for (var b = a[0], c, d = 0; d < this.rooms.length; d++)
        if (this.rooms[d].name == b) {
            c = this.rooms[d];
            this.rooms[d].update(a);
            break
        }
    return c
}
;
this.arcademics = this.arcademics || {};
arcademics.Booster = function() {
    jk.Container.call(this);
    var a = new jk.SVG("BoosterShadow");
    this.addChild(a);
    a = new jk.SVG("BoosterStructure");
    this.addChild(a);
    a = new jk.SVG("BoosterFire1");
    a.visible = !1;
    a.x = -35.75;
    a.y = -11.3;
    this.fire = this.addChild(a);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.Booster, jk.Container);
arcademics.Booster.getUID = jk.Container.getUID;
arcademics.Booster._nextUID = jk.Container._nextUID;
arcademics.Booster.prototype.play = function() {
    var a = this;
    this.fire.id = "BoosterFire1";
    this.fire.visible = !0;
    setTimeout(function() {
        a.fire.id = "BoosterFire2";
        a.fireTween = (new jk.Tween(null,{
            loop: !0
        })).call(function() {
            a.fire.scaleY = -1
        }, 1E3 / 30 * 2).call(function() {
            a.fire.scaleY = 1
        }, 1E3 / 30 * 2)
    }, 1E3 / 30 * 2)
}
;
arcademics.Booster.prototype.stop = function() {
    var a = this;
    this.fire.id = "BoosterFire1";
    setTimeout(function() {
        a.fire.visible = !1;
        a.fireTween.remove()
    }, 1E3 / 30 * 2)
}
;
this.arcademics = this.arcademics || {};
arcademics.Lightning = function() {
    jk.Container.call(this);
    var a = new jk.SVG("Lightning1");
    this.lightning = this.addChild(a);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.Lightning, jk.Container);
arcademics.Lightning.getUID = jk.Container.getUID;
arcademics.Lightning._nextUID = jk.Container._nextUID;
arcademics.Lightning.prototype.play = function() {
    var a = this;
    this.lightningTween = (new jk.Tween(null,{
        loop: !0
    })).call(function() {
        a.lightning.id = "Lightning1"
    }, 1E3 / 30 * 2).call(function() {
        a.lightning.id = "Lightning2"
    }, 1E3 / 30 * 2).call(function() {
        a.lightning.id = "Lightning3"
    }, 1E3 / 30 * 2).call(function() {
        a.lightning.id = "Lightning4"
    }, 1E3 / 30 * 2).call(function() {
        a.lightning.id = "Lightning5"
    }, 1E3 / 30 * 2).call(function() {
        a.lightning.id = "Lightning6"
    }, 1E3 / 30 * 2).call(function() {
        a.lightning.id = "Lightning7"
    }, 1E3 / 30 * 2)
}
;
arcademics.Lightning.prototype.stop = function() {
    this.lightning.id = "Lightning1";
    this.lightningTween.remove()
}
;
this.arcademics = this.arcademics || {};
arcademics.LightningAngled = function() {
    jk.Container.call(this);
    var a = new jk.SVG("LightningAngled1");
    this.addChild(a);
    (new jk.Tween(null,{
        loop: !0
    })).call(function() {
        a.id = "LightningAngled1"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningAngled2"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningAngled3"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningAngled4"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningAngled5"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningAngled6"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningAngled7"
    }, 1E3 / 30 * 2);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.LightningAngled, jk.Container);
arcademics.LightningAngled.getUID = jk.Container.getUID;
arcademics.LightningAngled._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.LightningStrike = function() {
    jk.Container.call(this);
    var a = new jk.SVG("LightningStrike1");
    a = this.addChild(a);
    (new jk.Tween(null,{
        loop: !0
    })).call(function() {
        a.id = "LightningStrike1"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningStrike2"
    }, 1E3 / 30 * 2);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.LightningStrike, jk.Container);
arcademics.LightningStrike.getUID = jk.Container.getUID;
arcademics.LightningStrike._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.LightningStun = function() {
    jk.Container.call(this);
    var a = new jk.SVG("LightningStun1");
    a = this.addChild(a);
    (new jk.Tween(null,{
        loop: !0
    })).call(function() {
        a.id = "LightningStun1"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningStun2"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningStun3"
    }, 1E3 / 30 * 2).call(function() {
        a.id = "LightningStun4"
    }, 1E3 / 30 * 2);
    this._calcInitDimensions()
}
;
$jscomp.inherits(arcademics.LightningStun, jk.Container);
arcademics.LightningStun.getUID = jk.Container.getUID;
arcademics.LightningStun._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.PowerUpReady = function() {
    jk.Container.call(this)
}
;
$jscomp.inherits(arcademics.PowerUpReady, jk.Container);
arcademics.PowerUpReady.getUID = jk.Container.getUID;
arcademics.PowerUpReady._nextUID = jk.Container._nextUID;
arcademics.PowerUpReady.prototype.play = function() {
    for (var a = [[.3, 1, 1, -66, -44, 1, -18, -14, 8], [.3, 1, 1, 66, -40, 1, 18, -8, 8], [.3, 1, 1, -12, 60, 1, 0, 18, 8], [.6, .7, .7, -54, 12, 1, -20, 8, 6], [.6, .7, .7, 50, 26, 1, 28, 10, 6], [.6, .7, .7, 2, -36, 1, 2, -16, 6]], b = 0; b < a.length; b++) {
        var c = a[b]
          , d = new jk.SVG("PowerUpReadyStar");
        d.alpha = c[0];
        d.scaleX = c[1];
        d.scaleY = c[2];
        d.x = c[3];
        d.y = c[4];
        this.addChild(d);
        (new jk.Tween(d)).to({
            alpha: c[5],
            x: c[6],
            y: c[7]
        }, 1E3 / 30 * c[8]).call(function() {
            this.target.parent.removeChild(this.target)
        })
    }
    a = new jk.SVG("PowerUpReadyPointer");
    a.visible = !1;
    a.x = -7;
    a.y = -3;
    this.addChild(a);
    (new jk.Tween(a)).wait(1E3 / 30 * 9).call(function() {
        this.target.visible = !0
    }).wait(1E3 / 30 * 16).to({
        alpha: .2
    }, 1E3 / 30 * 6).call(function() {
        this.target.parent.removeChild(this.target)
    })
}
;
this.arcademics = this.arcademics || {};
arcademics.IntroScreen = function() {
    jk.Container.call(this);
    setTimeout(this._timeout.bind(this), arcademics.Settings.introDuration);
    if (arcademics.Settings.introURL) {
        var a = new jk.Image(arcademics.Settings.introURL,arcademics.Settings.gameWidth,arcademics.Settings.gameHeight);
        this.addChild(a)
    } else {
        a = new jk.Rect(0,0,arcademics.Settings.gameWidth,arcademics.Settings.gameHeight,{
            fill: "#000000"
        });
        this.addChild(a);
        a = new jk.SVG("Logo");
        var b = (arcademics.Settings.gameWidth - a.width) / 2
          , c = b + 200;
        a.alpha = 0;
        a.x = b - 200;
        a.y = 150;
        this.addChild(a);
        (new jk.Tween(a)).wait(1E3 / 30 * 0).to({
            alpha: 1,
            x: b
        }, 1E3 / 30 * 10, jk.Ease.quadOut).wait(1E3 / 30 * 80).to({
            alpha: 0,
            x: c
        }, 1E3 / 30 * 10, jk.Ease.quadIn);
        c = new jk.Text;
        c.alpha = 0;
        c.color = "#FAA629";
        c.fontSize = 20;
        c.text = ".com";
        c.x = b + a.width - 5;
        c.y = 168;
        this.addChild(c);
        (new jk.Tween(c)).wait(1E3 / 30 * 6).to({
            alpha: 1
        }, 1E3 / 30 * 20).wait(1E3 / 30 * 64).to({
            alpha: 0,
            x: c.x + 200
        }, 1E3 / 30 * 10, jk.Ease.quadIn);
        a = new jk.Text;
        a.alpha = 0;
        a.color = "#CCCCCC";
        a.fontSize = 18;
        a.text = "Fun Educational Games for Kids!";
        a.text = "Skill-building Educational Games";
        a.x = (arcademics.Settings.gameWidth - a.width) / 2;
        a.y = 225;
        this.addChild(a);
        (new jk.Tween(a)).wait(1E3 / 30 * 12).to({
            alpha: 1
        }, 1E3 / 30 * 20).wait(1E3 / 30 * 58).to({
            alpha: 0
        }, 1E3 / 30 * 10);
        a = new jk.Text;
        a.alpha = 0;
        a.color = "#666666";
        a.fontSize = 14;
        a.text = arcademics.Locale.loadString("COPYRIGHT");
        a.x = (arcademics.Settings.gameWidth - a.width) / 2;
        a.y = 360;
        this.addChild(a);
        (new jk.Tween(a)).wait(1E3 / 30 * 18).to({
            alpha: 1
        }, 1E3 / 30 * 20).wait(1E3 / 30 * 52).to({
            alpha: 0
        }, 1E3 / 30 * 10);
        jk.Sound.play("intro");
        this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this._removedFromStage.bind(this))
    }
}
;
$jscomp.inherits(arcademics.IntroScreen, jk.Container);
arcademics.IntroScreen.getUID = jk.Container.getUID;
arcademics.IntroScreen._nextUID = jk.Container._nextUID;
arcademics.IntroScreen.prototype._removedFromStage = function(a) {
    jk.Sound.stopAll();
    jk.Tween.removeAll()
}
;
arcademics.IntroScreen.prototype._timeout = function() {
    1 != navigator.webdriver && (arcademics.Settings.gameType == arcademics.GameType.SINGLE ? arcademics.ScreenManager.show(arcademics.SPTitleScreen) : "Together" == arcademics.Settings.affiliate ? arcademics.ScreenManager.show(arcademics.PlayerScreen) : arcademics.ScreenManager.show(arcademics.TitleScreen))
}
;
this.arcademics = this.arcademics || {};
arcademics.GameScreen = function() {
    jk.Container.call(this);
    this.multiClient = arcademics.Settings.multiClient;
    this.numOfPlayers = arcademics.Settings.numOfPlayers;
    this.gameType = arcademics.Settings.gameType;
    this.selectedRoom = null;
    var a = new jk.SVG(arcademics.Settings.backgroundId);
    this.addChild(a);
    a = new arcademics.GameDialog;
    a.x = 20;
    a.y = 20;
    a.addEventListener(arcademics.GenericEvent.CREATE_GAME, this.gameDialog_createGame.bind(this));
    a.addEventListener(arcademics.GenericEvent.PLAY_NOW, this.gameDialog_playNow.bind(this));
    this.gameDialog = a;
    var b = new arcademics.CreateGameDialog;
    b.x = 190;
    b.y = 80;
    b.addEventListener(arcademics.GenericEvent.CLOSE, this.createGameDialog_close.bind(this));
    b.addEventListener(arcademics.GenericEvent.CREATE_GAME, this.createGameDialog_createGame.bind(this));
    this.createGameDialog = b;
    b = new arcademics.JoinGameDialog;
    b.x = 190;
    b.y = 110;
    b.addEventListener(arcademics.GenericEvent.CLOSE, this.joinGameDialog_close.bind(this));
    b.addEventListener(arcademics.GenericEvent.JOIN_GAME, this.joinGameDialog_joinGame.bind(this));
    this.joinGameDialog = b;
    b = new arcademics.ErrorDialog;
    b.x = 190;
    b.y = 130;
    b.addEventListener(arcademics.GenericEvent.CLOSE, this.errorDialog_close.bind(this));
    b.addEventListener(arcademics.GenericEvent.OK, this.errorDialog_ok.bind(this));
    this.errorDialog = b;
    b = new arcademics.GameList;
    b.x = 20;
    b.y = 70;
    b.addEventListener(arcademics.GenericEvent.ITEM_CLICK, this.gameList_itemClick.bind(this));
    b.init(this.multiClient.myZone.rooms);
    this.gameList = a.addChild(b);
    b = {
        ready: 0
    };
    this.multiClient.myUser.variables.ribbon != arcademics.Settings.ribbon && (b.ribbon = arcademics.Settings.ribbon);
    this.multiClient.myUser.variables.starLevel != arcademics.Settings.starLevel && (b.starLevel = arcademics.Settings.starLevel);
    this.multiClient.sendUserVariables(b);
    this.multiClient.addEventListener(arcademics.MultiClientEvent.ADD_ROOM, this.multiClient_addRoom.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.CREATE_ROOM, this.multiClient_createRoom.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.JOIN_ROOM, this.multiClient_joinRoom.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.REMOVE_ROOM, this.multiClient_removeRoom.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.UPDATE_ROOM, this.multiClient_updateRoom.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
    "Clever" == arcademics.Settings.affiliate || "Together" == arcademics.Settings.affiliate ? this.gameDialog_playNow(new arcademics.GenericEvent(arcademics.GenericEvent.PLAY_NOW)) : this.addChild(a)
}
;
$jscomp.inherits(arcademics.GameScreen, jk.Container);
arcademics.GameScreen.getUID = jk.Container.getUID;
arcademics.GameScreen._nextUID = jk.Container._nextUID;
arcademics.GameScreen.prototype.gameDialog_createGame = function(a) {
    this.removeChild(this.gameDialog);
    this.addChild(this.createGameDialog);
    this.createGameDialog.reset()
}
;
arcademics.GameScreen.prototype.gameDialog_playNow = function(a) {
    a = arcademics.Locale.loadString("GAME_NAME_PREFIX") + this.multiClient.myUser.name + arcademics.Locale.loadString("GAME_NAME_SUFFIX");
    this.multiClient.createOrJoinRoom(a, this.numOfPlayers)
}
;
arcademics.GameScreen.prototype.createGameDialog_close = function(a) {
    this.removeChild(this.createGameDialog);
    this.addChild(this.gameDialog)
}
;
arcademics.GameScreen.prototype.createGameDialog_createGame = function(a) {
    var b = arcademics.Locale.loadString("GAME_NAME_PREFIX") + this.multiClient.myUser.name + arcademics.Locale.loadString("GAME_NAME_SUFFIX");
    this.multiClient.createRoom(b, a.params.password, this.numOfPlayers)
}
;
arcademics.GameScreen.prototype.joinGameDialog_close = function(a) {
    this.removeChild(this.joinGameDialog);
    this.addChild(this.gameDialog)
}
;
arcademics.GameScreen.prototype.joinGameDialog_joinGame = function(a) {
    this.multiClient.joinRoom(this.selectedRoom.name, a.params.password)
}
;
arcademics.GameScreen.prototype.errorDialog_close = function(a) {
    this.removeChild(this.errorDialog);
    this.addChild(this.gameDialog)
}
;
arcademics.GameScreen.prototype.errorDialog_ok = function(a) {
    this.removeChild(this.errorDialog);
    this.addChild(this.gameDialog)
}
;
arcademics.GameScreen.prototype.gameList_itemClick = function(a) {
    if (a = a.params.room)
        this.selectedRoom = a,
        a.isPrivate ? (this.removeChild(this.gameDialog),
        this.addChild(this.joinGameDialog),
        this.joinGameDialog.reset()) : this.multiClient.joinRoom(a.name, "")
}
;
arcademics.GameScreen.prototype.multiClient_addRoom = function(a) {
    this.gameList.add(a.params.room)
}
;
arcademics.GameScreen.prototype.multiClient_createRoom = function(a) {
    if (a.params.success)
        this.gameType == arcademics.GameType.FFA ? 4 == this.numOfPlayers ? arcademics.ScreenManager.show(arcademics.LobbyScreen4) : 12 == this.numOfPlayers && arcademics.ScreenManager.show(arcademics.LobbyScreen12) : this.gameType == arcademics.GameType.TEAM2 ? arcademics.ScreenManager.show(arcademics.LobbyScreen8T2) : this.gameType == arcademics.GameType.TEAM4 && arcademics.ScreenManager.show(arcademics.LobbyScreen8T4);
    else {
        this.removeChild(this.gameDialog);
        this.removeChild(this.createGameDialog);
        var b = arcademics.Locale.loadString("CREATE_GAME_ERROR")
          , c = arcademics.Locale.loadString("CREATE_GAME_ERROR_DESCRIPTION");
        "Room password is inappropriate." == a.params.error && (c = arcademics.Locale.loadString("PASSWORD_INAPPROPRIATE"));
        this.addChild(this.errorDialog);
        this.errorDialog.display(b, c)
    }
}
;
arcademics.GameScreen.prototype.multiClient_joinRoom = function(a) {
    if (a.params.success)
        this.gameType == arcademics.GameType.FFA ? 4 == this.numOfPlayers ? arcademics.ScreenManager.show(arcademics.LobbyScreen4) : 12 == this.numOfPlayers && arcademics.ScreenManager.show(arcademics.LobbyScreen12) : this.gameType == arcademics.GameType.TEAM2 ? arcademics.ScreenManager.show(arcademics.LobbyScreen8T2) : this.gameType == arcademics.GameType.TEAM4 && arcademics.ScreenManager.show(arcademics.LobbyScreen8T4);
    else {
        this.removeChild(this.gameDialog);
        this.removeChild(this.joinGameDialog);
        a = arcademics.Locale.loadString("JOIN_GAME_ERROR");
        var b = arcademics.Locale.loadString("JOIN_GAME_ERROR_DESCRIPTION");
        this.addChild(this.errorDialog);
        this.errorDialog.display(a, b)
    }
}
;
arcademics.GameScreen.prototype.multiClient_removeRoom = function(a) {
    this.gameList.remove(a.params.room)
}
;
arcademics.GameScreen.prototype.multiClient_updateRoom = function(a) {
    this.gameList.update(a.params.room)
}
;
arcademics.GameScreen.prototype.removedFromStage = function(a) {
    this.multiClient.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.GameplayScreen = function() {
    jk.Container.call(this);
    var a = new jk.SVG(arcademics.Settings.backgroundId);
    this.addChild(a);
    a = new arcademics.Settings.gameplayClass;
    this.addChild(a);
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.GameplayScreen, jk.Container);
arcademics.GameplayScreen.getUID = jk.Container.getUID;
arcademics.GameplayScreen._nextUID = jk.Container._nextUID;
arcademics.GameplayScreen.prototype.removedFromStage = function(a) {
    jk.Sound.stopAll();
    jk.Tween.removeAll()
}
;
this.arcademics = this.arcademics || {};
arcademics.LobbyScreen = function() {
    jk.Container.call(this);
    this.numOfPlayers = arcademics.Settings.numOfPlayers;
    this.multiClient = arcademics.Settings.multiClient;
    this.colors = arcademics.ColorPicker.defaultColors;
    this.computerFilter = new jk.ColorMatrixFilter(.5,.5,.5);
    var a = new jk.SVG(arcademics.Settings.backgroundId);
    this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Montserrat, sans-serif";
    a.fontSize = 24;
    a.text = "Together" == arcademics.Settings.affiliate ? arcademics.Settings.gameTitle : this.multiClient.myRoom.name;
    a.width = 260;
    a.x = 20;
    a.y = 20;
    this.addChild(a);
    a = new jk.Rect(300,0,470,66,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.boxTextColor;
    a.fontFamily = "Arial";
    a.fontSize = 16;
    a.text = "0 / 0";
    a.textAlign = "center";
    "Together" == arcademics.Settings.affiliate && (a.visible = !1);
    a.x = 365;
    a.y = 10;
    this.outOfField = this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.boxTextColor;
    a.fontFamily = "Arial";
    a.fontSize = 12;
    a.text = arcademics.Locale.loadString("PLAYERS_READY");
    a.textAlign = "center";
    "Together" == arcademics.Settings.affiliate && (a.visible = !1);
    a.width = 100;
    a.x = 365;
    a.y = 30;
    this.playersReadyField = this.addChild(a);
    a = new arcademics.PrimaryButton;
    a.label = arcademics.Locale.loadString("START_BUTTON");
    a.x = 425;
    a.y = 15;
    a.addEventListener(jk.MouseEvent.CLICK, this.startGameButton_click.bind(this));
    this.startGameButton = this.addChild(a);
    a = new arcademics.SecondaryButton;
    if ("Clever" == arcademics.Settings.affiliate || "Together" == arcademics.Settings.affiliate)
        a.enabled = !1;
    a.label = arcademics.Locale.loadString("LEAVE_BUTTON");
    a.x = 565;
    a.y = 17;
    a.addEventListener(jk.MouseEvent.CLICK, this.leaveGameButton_click.bind(this));
    this.leaveGameButton = this.addChild(a);
    a = new arcademics.ColorPicker(!arcademics.Settings.isAffiliate,arcademics.Settings.starLevel);
    a.visible = !1;
    a.x = 266;
    a.y = 95;
    a.addEventListener(arcademics.GenericEvent.SELECT_COLOR, this.colorPicker_selectColor.bind(this));
    this.colorPicker = this.addChild(a);
    this.leaveRoomRequested = this.doOnce = !1;
    a = new jk.Timer(1E3,3);
    a.addEventListener(jk.Event.TIMER, this.countdownTimer_timer.bind(this));
    a.addEventListener(jk.Event.TIMER_COMPLETE, this.countdownTimer_timerComplete.bind(this));
    this.countdownTimer = a;
    a = new jk.Timer(0,1);
    a.addEventListener(jk.Event.TIMER_COMPLETE, this.startMessageTimer_timerComplete.bind(this));
    this.startMessageTimer = a;
    this.multiClient.addEventListener(arcademics.MultiClientEvent.ADD_USER, this.multiClient_addUser.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.LEAVE_ROOM, this.multiClient_leaveRoom.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.REMOVE_USER, this.multiClient_removeUser.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.ROOM_MESSAGE, this.multiClient_roomMessage.bind(this));
    this.multiClient.addEventListener(arcademics.MultiClientEvent.USER_VARIABLES, this.multiClient_userVariables.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.LobbyScreen, jk.Container);
arcademics.LobbyScreen.getUID = jk.Container.getUID;
arcademics.LobbyScreen._nextUID = jk.Container._nextUID;
arcademics.LobbyScreen.prototype.updatePlayers = function(a) {
    for (var b = 0, c = 0; c < a.length; c++)
        "1" == a[c].variables.ready && b++;
    this.outOfField.text = b + " / " + a.length;
    0 < b && !this.doOnce && (this.outOfField.visible = !1,
    this.playersReadyField.visible = !1,
    this.showLobbyCountdown(),
    this.doOnce = !0);
    b = a[0].name == this.multiClient.myUser.name;
    this.multiClient.myRoom.isPrivate && (this.startGameButton.enabled = b && !this.doOnce);
    "Together" == arcademics.Settings.affiliate && (this.startGameButton.enabled = 1 < a.length && !this.doOnce)
}
;
arcademics.LobbyScreen.prototype.showLobbyCountdown = function() {
    var a = new arcademics.CountdownClip;
    a.label = "3";
    a.height = 40;
    a.width = 40;
    a.x = 345;
    a.y = 10;
    this.countdownClip = this.addChild(a);
    this.countdownTimer.reset();
    this.countdownTimer.start()
}
;
arcademics.LobbyScreen.prototype.startGameButton_click = function(a) {
    this.multiClient.sendUserVariables({
        ready: 1
    });
    this.startGameButton.enabled = !1;
    this.leaveGameButton.enabled = !1;
    jk.Sound.play("click")
}
;
arcademics.LobbyScreen.prototype.leaveGameButton_click = function(a) {
    this.multiClient.leaveRoom();
    this.leaveRoomRequested = !0;
    jk.Sound.play("click")
}
;
arcademics.LobbyScreen.prototype.colorPicker_selectColor = function(a) {
    this.colorPicker.visible = !1;
    this.multiClient.sendUserVariables({
        color: a.params.color
    })
}
;
arcademics.LobbyScreen.prototype.countdownTimer_timer = function(a) {
    this.countdownClip.label = 2 - a.currentTarget.currentCount
}
;
arcademics.LobbyScreen.prototype.countdownTimer_timerComplete = function(a) {
    a = 0;
    for (var b = this.multiClient.myRoom.users, c = 0; c < b.length; c++)
        if (b[c].name == this.multiClient.myUser.name) {
            a = 500 * c;
            break
        }
    this.startMessageTimer.delay = a;
    this.startMessageTimer.start()
}
;
arcademics.LobbyScreen.prototype.startMessageTimer_timerComplete = function(a) {
    this.multiClient.updateRoom(!1);
    this.multiClient.sendRoomMessage(arcademics.Settings.gameplayClass.generateStartMessage())
}
;
arcademics.LobbyScreen.prototype.multiClient_addUser = function(a) {
    this.updatePlayers(this.multiClient.myRoom.users)
}
;
arcademics.LobbyScreen.prototype.multiClient_leaveRoom = function(a) {
    arcademics.ScreenManager.show(arcademics.GameScreen)
}
;
arcademics.LobbyScreen.prototype.multiClient_removeUser = function(a) {
    this.updatePlayers(this.multiClient.myRoom.users)
}
;
arcademics.LobbyScreen.prototype.multiClient_roomMessage = function(a) {
    if (!this.leaveRoomRequested && a.params.message.start) {
        for (var b = 0; b < this.players.length; b++) {
            var c = this.players[b];
            c.name == this.multiClient.myUser.name && "human" == c.type && (arcademics.Settings.myPlayer = c,
            arcademics.Settings.playerId = b)
        }
        arcademics.Settings.players = this.players;
        arcademics.Settings.startMessage = a.params.message;
        arcademics.ScreenManager.show(arcademics.GameplayScreen)
    }
}
;
arcademics.LobbyScreen.prototype.multiClient_userVariables = function(a) {
    this.updatePlayers(this.multiClient.myRoom.users)
}
;
arcademics.LobbyScreen.prototype.removedFromStage = function(a) {
    this.countdownTimer.stop();
    this.startMessageTimer.stop();
    this.multiClient.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.LobbyScreen12 = function() {
    arcademics.LobbyScreen.call(this);
    this.stagingClips = [];
    var a = new arcademics.LobbySprite4;
    a.selected = !0;
    a.x = 30;
    a.y = 90;
    a.playerIconClip.cursor = "pointer";
    a.playerIconClip.addEventListener(jk.MouseEvent.CLICK, this.object_click.bind(this));
    this.addChild(a);
    this.stagingClips.push(a);
    for (var b = 0; 11 > b; b++) {
        a = new arcademics.LobbySprite12;
        a.x = 230 * Math.floor(b / 6) + 240;
        a.y = b % 6 * 46 + 90;
        this.addChild(a);
        this.stagingClips.push(a);
        if (0 == b % 6) {
            var c = new jk.Path("M " + a.x + " " + a.y + " L " + (a.x + 200) + " " + a.y,{
                stroke: "#000000",
                "stroke-opacity": .15
            });
            this.addChild(c)
        }
        c = new jk.Path("M " + a.x + " " + (a.y + a.height + 10) + " L " + (a.x + 200) + " " + (a.y + a.height + 10),{
            stroke: "#000000",
            "stroke-opacity": .15
        });
        this.addChild(c)
    }
    for (b = 0; b < this.multiClient.myRoom.users.length; b++)
        if (a = this.multiClient.myRoom.users[b],
        a.name == this.multiClient.myUser.name) {
            void 0 == a.variables.color ? (b = this.colors[b % this.colors.length],
            this.multiClient.sendUserVariables({
                color: b
            }),
            this.colorPicker.selectColor(b)) : this.colorPicker.selectColor(a.variables.color);
            break
        }
    this.updatePlayers(this.multiClient.myRoom.users)
}
;
$jscomp.inherits(arcademics.LobbyScreen12, arcademics.LobbyScreen);
arcademics.LobbyScreen12.getUID = arcademics.LobbyScreen.getUID;
arcademics.LobbyScreen12._nextUID = arcademics.LobbyScreen._nextUID;
arcademics.LobbyScreen12.prototype.updatePlayers = function(a) {
    arcademics.LobbyScreen.prototype.updatePlayers.call(this, a);
    this.players = [];
    for (var b = 1, c, d = 0; d < this.numOfPlayers; d++) {
        c = a[d];
        var e = {};
        c ? (e.name = c.name,
        e.type = "human",
        e.ribbon = c.variables.ribbon,
        e.starLevel = c.variables.starLevel,
        e.color = void 0 == c.variables.color ? this.colors[d % this.colors.length] : c.variables.color) : (e.name = arcademics.Locale.loadString("COMPUTER_PREFIX") + " " + (d + 1),
        e.type = "computer",
        e.color = this.colors[d % this.colors.length],
        e.ribbon = void 0,
        e.starLevel = void 0);
        e.name == this.multiClient.myUser.name ? c = 0 : (c = b,
        b++);
        this.stagingClips[c].playerNameField.text = e.name;
        this.stagingClips[c].ribbon = e.ribbon;
        this.stagingClips[c].starLevel = e.starLevel;
        this.stagingClips[c].playerIconClip.filters = "human" == e.type ? [] : [this.computerFilter];
        this.stagingClips[c].playerIconClip.color = e.color;
        this.players.push(e)
    }
}
;
arcademics.LobbyScreen12.prototype.object_click = function(a) {
    this.setChildIndex(this.colorPicker, this.numChildren);
    this.colorPicker.visible = !0
}
;
this.arcademics = this.arcademics || {};
arcademics.PlayerScreen = function() {
    jk.Container.call(this);
    this.playerName = arcademics.Locale.loadString("PLAYER_PREFIX") + arcademics.RandomUtility.randomInteger(1, 999);
    if (null != arcademics.Settings.playerName) {
        var a = arcademics.Settings.playerName;
        a = a.replace(/[^A-Za-z0-9]/g, "");
        if (a = a.match(/[A-Za-z]+[0-9]{0,6}/))
            a = a[0],
            a = a.substring(0, 1).toUpperCase() + a.substring(1),
            this.playerName = a = a.substring(0, 10);
        if ("Clever" == arcademics.Settings.affiliate || "Together" == arcademics.Settings.affiliate)
            this.playerName = arcademics.Settings.playerName
    }
    this.zoneName = arcademics.Settings.zoneName;
    this.multiClient = arcademics.Settings.multiClient;
    a = new jk.SVG(arcademics.Settings.backgroundId);
    this.addChild(a);
    a = new arcademics.PlayerDialog(this.multiClient.connected,this.playerName,arcademics.Settings.playerNameEditable);
    a.x = 190;
    a.y = 110;
    a.addEventListener(arcademics.GenericEvent.NEXT, this.playerDialog_next.bind(this));
    this.playerDialog = a;
    var b = new arcademics.ErrorDialog;
    b.x = 190;
    b.y = 130;
    b.addEventListener(arcademics.GenericEvent.CLOSE, this.errorDialog_close.bind(this));
    b.addEventListener(arcademics.GenericEvent.OK, this.errorDialog_ok.bind(this));
    this.errorDialog = b;
    0 == this.multiClient.connected && this.multiClient.close();
    this.multiClient.addEventListener(arcademics.MultiClientEvent.LOGIN, this.multiClient_login.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
    "Clever" == arcademics.Settings.affiliate || "Together" == arcademics.Settings.affiliate ? this.playerDialog_next(new arcademics.GenericEvent(arcademics.GenericEvent.NEXT,null,{
        playerName: this.playerName
    })) : this.addChild(a)
}
;
$jscomp.inherits(arcademics.PlayerScreen, jk.Container);
arcademics.PlayerScreen.getUID = jk.Container.getUID;
arcademics.PlayerScreen._nextUID = jk.Container._nextUID;
arcademics.PlayerScreen.prototype.hideErrorDialog = function() {
    this.addChild(this.playerDialog);
    this.removeChild(this.errorDialog)
}
;
arcademics.PlayerScreen.prototype.showErrorDialog = function(a, b) {
    this.removeChild(this.playerDialog);
    this.addChild(this.errorDialog);
    this.errorDialog.display(a, b)
}
;
arcademics.PlayerScreen.prototype.playerDialog_next = function(a) {
    this.multiClient.login(a.params.playerName, this.zoneName)
}
;
arcademics.PlayerScreen.prototype.errorDialog_close = function(a) {
    this.hideErrorDialog()
}
;
arcademics.PlayerScreen.prototype.errorDialog_ok = function(a) {
    this.hideErrorDialog()
}
;
arcademics.PlayerScreen.prototype.multiClient_login = function(a) {
    if (a.params.success)
        "Poki" == arcademics.Settings.affiliate ? PokiSDK.commercialBreak().then(function() {
            arcademics.ScreenManager.show(arcademics.GameScreen)
        }) : arcademics.ScreenManager.show(arcademics.GameScreen);
    else {
        var b = arcademics.Locale.loadString("LOGIN_ERROR")
          , c = "";
        "User name already exists." == a.params.error && (c = arcademics.Locale.loadString("USERNAME_EXISTS"));
        "User name is inappropriate." == a.params.error && (c = arcademics.Locale.loadString("USERNAME_INAPPROPRIATE"));
        this.showErrorDialog(b, c)
    }
}
;
arcademics.PlayerScreen.prototype.removedFromStage = function(a) {
    this.multiClient.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.ResultsScreen = function() {
    jk.Container.call(this);
    this.gameTitle = arcademics.Settings.gameTitle;
    this.numOfPlayers = arcademics.Settings.numOfPlayers;
    this.gameType = arcademics.Settings.gameType;
    this.scoreType = arcademics.Settings.scoreType;
    this.questionType = arcademics.Settings.questionType;
    this.multiClient = arcademics.Settings.multiClient;
    this.myPlayer = arcademics.Settings.myPlayer;
    this.players = arcademics.Settings.players;
    this.lastGameInstance = arcademics.Settings.lastGameInstance;
    this.winningTeam = arcademics.Settings.winningTeam;
    this.placeSuffixes = [arcademics.Locale.loadString("PLACE_1"), arcademics.Locale.loadString("PLACE_2"), arcademics.Locale.loadString("PLACE_3"), arcademics.Locale.loadString("PLACE_4"), arcademics.Locale.loadString("PLACE_5"), arcademics.Locale.loadString("PLACE_6"), arcademics.Locale.loadString("PLACE_7"), arcademics.Locale.loadString("PLACE_8"), arcademics.Locale.loadString("PLACE_9"), arcademics.Locale.loadString("PLACE_10"), arcademics.Locale.loadString("PLACE_11"), arcademics.Locale.loadString("PLACE_12")];
    this.monthAbbrevs = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
    var a = new jk.SVG(arcademics.Settings.backgroundId);
    this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Montserrat, sans-serif";
    a.fontSize = 24;
    a.text = arcademics.Locale.loadString("RESULTS");
    a.x = 20;
    a.y = 20;
    this.addChild(a);
    a = new arcademics.Button("PrintButton");
    a.ariaLabel = "Print";
    a.x = 364;
    a.y = 20;
    arcademics.Settings.printEnabled && (this.printButton = this.addChild(a),
    this.printButton.addEventListener(jk.MouseEvent.CLICK, this.printButton_click.bind(this)));
    a = [];
    if (this.gameType == arcademics.GameType.FFA || this.gameType == arcademics.GameType.TEAM4) {
        var b = new jk.Container;
        if (this.gameType == arcademics.GameType.FFA)
            for (var c = 0; c < this.players.length; c++) {
                var d = new arcademics.ResultsSprite4;
                d.x = 0;
                d.y = 75 * c;
                b.addChild(d);
                a.push(d)
            }
        else if (this.gameType == arcademics.GameType.TEAM4)
            for (c = 0; c < this.players.length / 2; c++)
                d = new arcademics.ResultsSprite8T4,
                d.x = 0,
                d.y = 75 * c,
                b.addChild(d),
                a.push(d);
        var e = new arcademics.ScrollPane;
        e.content = b;
        e.height = 340;
        e.width = 400;
        e.x = 0;
        e.y = 60;
        this.addChild(e)
    } else if (this.gameType == arcademics.GameType.TEAM2) {
        b = new jk.Rect(20,60,180,320,{
            fill: "#AA5562"
        });
        this.addChild(b);
        b = new jk.SVG("RedFlag");
        b.x = 30;
        b.y = 70;
        this.addChild(b);
        c = new jk.Text;
        c.color = "#660000";
        c.fontFamily = "Arial";
        c.fontSize = 16;
        c.fontWeight = "bold";
        c.text = arcademics.Locale.loadString("RED_TEAM");
        c.x = 48;
        c.y = 70;
        this.addChild(c);
        b = new jk.Text;
        b.color = "#660000";
        b.fontFamily = "Arial";
        b.fontSize = 10;
        b.fontWeight = "bold";
        b.text = arcademics.Locale.loadString("CORRECT");
        b.textAlign = "center";
        b.x = 160;
        b.y = 96;
        this.addChild(b);
        d = new jk.Rect(220,60,180,320,{
            fill: "#4073BF"
        });
        this.addChild(d);
        d = new jk.SVG("BlueFlag");
        d.x = 230;
        d.y = 70;
        this.addChild(d);
        var f = new jk.Text;
        f.color = "#000066";
        f.fontFamily = "Arial";
        f.fontSize = 16;
        f.fontWeight = "bold";
        f.text = arcademics.Locale.loadString("BLUE_TEAM");
        f.x = 248;
        f.y = 70;
        this.addChild(f);
        d = new jk.Text;
        d.color = "#000066";
        d.fontFamily = "Arial";
        d.fontSize = 10;
        d.fontWeight = "bold";
        d.text = arcademics.Locale.loadString("CORRECT");
        d.textAlign = "center";
        d.x = 360;
        d.y = 96;
        this.addChild(d);
        0 == this.winningTeam ? c.text = arcademics.Locale.loadString("RED_TEAM_WINS") + "!" : f.text = arcademics.Locale.loadString("BLUE_TEAM_WINS") + "!";
        for (c = 0; c < this.players.length; c++) {
            if (4 > c) {
                f = arcademics.Settings.playerIconRedId;
                var g = "#660000"
            } else
                f = arcademics.Settings.playerIconBlueId,
                g = "#000066";
            f = new arcademics.ResultsSprite8T2(f,g);
            f.x = 200 * Math.floor(c / 4) + 22;
            f.y = c % 4 * 70 + 98;
            this.addChild(f);
            a.push(f)
        }
        this.setChildIndex(b, this.numChildren - 1);
        this.setChildIndex(d, this.numChildren - 1)
    }
    b = new jk.Rect(420,0,280,400,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.addChild(b);
    d = new jk.Text;
    d.color = "#CCCCCC";
    d.fontFamily = "Arial";
    d.fontSize = 14;
    d.text = arcademics.Locale.loadString("ACCURACY") + ":";
    d.x = 440;
    d.y = 16;
    this.addChild(d);
    b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Arial";
    b.fontSize = 16;
    b.fontWeight = "bold";
    b.text = this.lastGameInstance.accuracy + "%";
    b.x = d.x + d.width + 2;
    b.y = 15;
    this.addChild(b);
    d = new jk.Text;
    d.color = "#CCCCCC";
    d.fontFamily = "Arial";
    d.fontSize = 14;
    d.text = arcademics.Locale.loadString("RATE") + ":";
    d.x = b.x + b.width + 16;
    d.y = 16;
    this.addChild(d);
    b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Arial";
    b.fontSize = 16;
    b.fontWeight = "bold";
    b.text = this.lastGameInstance.rate + arcademics.Locale.loadString("PER_MINUTE");
    b.x = d.x + d.width + 2;
    b.y = 15;
    this.addChild(b);
    c = new jk.Path("M 435 50 L 685 50",{
        stroke: "#000000",
        "stroke-opacity": .5
    });
    this.addChild(c);
    b = new jk.Text;
    b.color = "#CCCCCC";
    b.fontFamily = "Arial";
    b.fontSize = 14;
    b.text = arcademics.Locale.loadString("MISSED_QUESTIONS");
    b.x = 440;
    b.y = 63;
    this.addChild(b);
    switch (this.questionType) {
    case arcademics.QuestionType.ALGEBRA:
    case arcademics.QuestionType.ARITHMETIC:
    case arcademics.QuestionType.COMPARISON:
    case arcademics.QuestionType.MATCHING:
    case arcademics.QuestionType.ROUNDING:
        var h = "right";
        break;
    case arcademics.QuestionType.ANSWER_ONLY:
    case arcademics.QuestionType.CAPITAL:
    case arcademics.QuestionType.NORMAL:
    case arcademics.QuestionType.QUESTION_ONLY:
        h = "left"
    }
    b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Arial";
    b.fontSize = 16;
    b.multiline = !0;
    b.textAlign = h;
    b.x = 440;
    b.y = 91;
    this.addChild(b);
    d = new jk.Text;
    d.color = arcademics.Settings.boxTextColor;
    d.fontFamily = "Arial";
    d.fontSize = 16;
    d.multiline = !0;
    d.x = 440;
    d.y = 91;
    this.addChild(d);
    if (void 0 != arcademics.Settings.badgesDiff && void 0 != arcademics.Settings.pointsDiff && (c = new jk.Path("M 435 253 L 685 253",{
        stroke: "#000000",
        "stroke-opacity": .5
    }),
    this.addChild(c),
    c = new jk.Text,
    c.color = "#CCCCCC",
    c.fontFamily = "Arial",
    c.fontSize = 14,
    c.text = arcademics.Locale.loadString("POINTS"),
    c.x = 440,
    c.y = 264,
    this.addChild(c),
    f = new jk.Rect(0,290,0,26,{
        fill: "#000000",
        "fill-opacity": .5
    }),
    this.addChild(f),
    c = new jk.Text,
    c.color = arcademics.Settings.boxTextColor,
    c.fontFamily = "Arial",
    c.fontSize = 16,
    c.text = this.lastGameInstance.hits,
    c.x = 446,
    c.y = 293,
    this.addChild(c),
    f.x = c.x - 6,
    f.width = c.width + 12,
    0 < arcademics.Settings.badgesDiff.length)) {
        g = new jk.Text;
        g.color = arcademics.Settings.boxTextColor;
        g.fontFamily = "Arial";
        g.fontSize = 16;
        g.text = "+";
        g.x = c.x + c.width + 10;
        g.y = 293;
        this.addChild(g);
        f = {
            "first-place": "BadgeFirstPlace",
            "on-fire": "BadgeOnFire",
            "games-played-goal": "BadgeGamesPlayedGoal",
            "performance-goal": "BadgePerformanceGoal",
            "beat-my-best-3": "BadgeBeatMyBest",
            "hit-streak-100": "BadgeHitStreak",
            "day-streak-5": "BadgeDayStreak",
            "games-played-50": "BadgeGamesPlayed"
        };
        g = g.x + g.width + 8;
        for (c = 0; c < arcademics.Settings.badgesDiff.length; c++) {
            var k = new jk.SVG(f[arcademics.Settings.badgesDiff[c]]);
            k.x = g;
            k.y = 290;
            this.addChild(k);
            g = k.x + k.width + 8
        }
        c = new jk.Text;
        c.color = arcademics.Settings.boxTextColor;
        c.fontFamily = "Arial";
        c.fontSize = 16;
        c.text = "=";
        c.x = g;
        c.y = 293;
        this.addChild(c);
        f = new jk.Rect(0,290,0,26,{
            fill: "#000000",
            "fill-opacity": .5
        });
        this.addChild(f);
        g = new jk.Text;
        g.color = arcademics.Settings.boxTextColor;
        g.fontFamily = "Arial";
        g.fontSize = 16;
        g.text = this.lastGameInstance.hits + arcademics.Settings.pointsDiff;
        g.x = c.x + c.width + 10;
        g.y = 293;
        this.addChild(g);
        f.x = g.x - 6;
        f.width = g.width + 12
    }
    c = new jk.Path("M 435 330 L 685 330",{
        stroke: "#000000",
        "stroke-opacity": .5
    });
    this.addChild(c);
    c = new arcademics.PrimaryButton;
    c.label = arcademics.Locale.loadString("PLAY_AGAIN_BUTTON");
    c.x = 440;
    c.y = 400 - c.height - 15;
    c.addEventListener(jk.MouseEvent.CLICK, this.playAgainButton_click.bind(this));
    this.addChild(c);
    arcademics.Settings.endGameEnabled && (c = new arcademics.SecondaryButton,
    c.label = arcademics.Locale.loadString("END_GAME_BUTTON"),
    c.width = 100,
    c.x = 580,
    c.y = 400 - c.height - 17,
    c.addEventListener(jk.MouseEvent.CLICK, this.endGameButton_click.bind(this)),
    this.addChild(c));
    this.sortAndPlace(this.players, this.scoreType, this.gameType);
    if (this.gameType == arcademics.GameType.TEAM2) {
        f = [];
        for (c = 0; c < this.numOfPlayers; c++)
            0 == this.players[c].team && f.push(this.players[c]);
        for (c = 0; c < this.numOfPlayers; c++)
            1 == this.players[c].team && f.push(this.players[c]);
        this.players = f
    }
    if (this.gameType == arcademics.GameType.FFA || this.gameType == arcademics.GameType.TEAM2)
        for (c = 0; c < this.players.length; c++)
            f = a[c],
            "ghost" == this.players[c].type ? f.visible = !1 : (f.playerName = this.players[c].name,
            f.playerColor = this.players[c].color,
            -1 != this.players[c].place && (f.place = this.players[c].place,
            f.placeString = this.getPlaceString(this.players[c].place)),
            f.scoreString = this.getScoreString(this.players[c].score, this.scoreType),
            f.selected = this.players[c].name == this.multiClient.myUser.name);
    else if (this.gameType == arcademics.GameType.TEAM4)
        for (c = 0; c < this.players.length / 2; c++)
            f = a[c],
            f.playerName1 = this.players[2 * c].name,
            f.playerColor1 = this.players[2 * c].color,
            f.playerName2 = this.players[2 * c + 1].name,
            f.playerColor2 = this.players[2 * c + 1].color,
            f.place = this.players[2 * c].place,
            f.placeString = this.getPlaceString(this.players[2 * c].place),
            f.scoreString = this.getScoreString(this.players[2 * c].score, this.scoreType),
            f.selected = this.players[2 * c].name == this.multiClient.myUser.name || this.players[2 * c + 1].name == this.multiClient.myUser.name,
            this.players[2 * c].name == this.multiClient.myUser.name ? this.myPlayer = this.players[2 * c] : this.players[2 * c + 1].name == this.multiClient.myUser.name && (this.myPlayer = this.players[2 * c + 1]);
    this.gameType != arcademics.GameType.FFA && this.gameType != arcademics.GameType.TEAM4 || setTimeout(function() {
        e.scrollTo(0, 75 * (this.myPlayer.place - 3))
    }
    .bind(this), 250);
    f = a = "";
    g = this.getMissedQuestions(this.lastGameInstance.responses, this.questionType, 6);
    for (c = 0; c < g.length; c++)
        a += g[c].f1 + "\n",
        f += g[c].f2 + "\n";
    b.text = a;
    "right" == h && (b.x = 440 + b.width);
    d.text = f;
    d.x = 440 + b.width;
    this.printButton && (this.printButton.enabled = 0 <= this.myPlayer.place && 3 >= this.myPlayer.place);
    if (0 <= arcademics.Settings.hostname.endsWith("arcademics.com"))
        try {
            window.parent.googletag.pubads().refresh()
        } catch (l) {}
}
;
$jscomp.inherits(arcademics.ResultsScreen, jk.Container);
arcademics.ResultsScreen.getUID = jk.Container.getUID;
arcademics.ResultsScreen._nextUID = jk.Container._nextUID;
arcademics.ResultsScreen.prototype.sortAndPlace = function(a, b, c) {
    b == arcademics.ScoreType.SCORE ? a.sort(function(a, b) {
        return b.score - a.score
    }) : b == arcademics.ScoreType.TIME && a.sort(function(a, b) {
        return a.score - b.score
    });
    for (var d = 0, e = 0; e < this.numOfPlayers; e++)
        a[e].score == a[d].score ? a[e].place = d + 1 : (c == arcademics.GameType.FFA || c == arcademics.GameType.TEAM2 ? a[e].place = e + 1 : c == arcademics.GameType.TEAM4 && (a[e].place = Math.floor(e / 2) + 1),
        d = e),
        "time" == b && 36E5 <= a[e].score && (a[e].place = -1)
}
;
arcademics.ResultsScreen.prototype.getPlaceString = function(a) {
    return this.placeSuffixes[a - 1] + ":"
}
;
arcademics.ResultsScreen.prototype.getScoreString = function(a, b) {
    if (b == arcademics.ScoreType.SCORE)
        return String(a);
    if (b == arcademics.ScoreType.TIME) {
        if (36E5 <= a)
            return "--.-- " + arcademics.Locale.loadString("SEC");
        a = String(Math.floor(a / 10));
        return a.substring(0, a.length - 2) + "." + a.substr(a.length - 2, a.length) + " " + arcademics.Locale.loadString("SEC")
    }
    return ""
}
;
arcademics.ResultsScreen.prototype.getMissedQuestions = function(a, b, c) {
    if (arcademics.Settings.contentHTML)
        return [];
    for (var d = [], e = 0; e < a.length; e++)
        if (a[e].correctAnswer != a[e].userAnswer) {
            var f = {};
            if (b == arcademics.QuestionType.ALGEBRA)
                f.f1 = a[e].question + "  x = ",
                f.f2 = a[e].correctAnswer;
            else if (b == arcademics.QuestionType.ANSWER_ONLY)
                f.f1 = a[e].correctAnswer,
                f.f2 = "";
            else if (b == arcademics.QuestionType.ARITHMETIC)
                f.f1 = a[e].question + " = ",
                f.f2 = a[e].correctAnswer;
            else if (b == arcademics.QuestionType.CAPITAL)
                f.f1 = a[e].question + ", " + a[e].correctAnswer,
                f.f2 = "";
            else if (b == arcademics.QuestionType.COMPARISON) {
                var g = a[e].question.split("?");
                f.f1 = g[0] + " " + a[e].correctAnswer + " ";
                f.f2 = g[1]
            } else
                b == arcademics.QuestionType.MATCHING ? (f.f1 = a[e].question + " / ",
                f.f2 = a[e].correctAnswer) : b == arcademics.QuestionType.NORMAL ? (f.f1 = a[e].question + " " + a[e].correctAnswer,
                f.f2 = "") : b == arcademics.QuestionType.QUESTION_ONLY ? (f.f1 = a[e].question,
                f.f2 = "") : b == arcademics.QuestionType.ROUNDING && (f.f1 = a[e].question + " \u2248 ",
                f.f2 = a[e].correctAnswer);
            d.push(f);
            if (d.length == c)
                break
        }
    return d
}
;
arcademics.ResultsScreen.prototype.playAgainButton_click = function(a) {
    jk.Sound.play("click");
    "Poki" == arcademics.Settings.affiliate ? (arcademics.RandomUtility.randomBoolean(),
    PokiSDK.commercialBreak().then(function() {
        arcademics.ScreenManager.show(arcademics.GameScreen)
    })) : arcademics.ScreenManager.show(arcademics.GameScreen)
}
;
arcademics.ResultsScreen.prototype.endGameButton_click = function(a) {
    jk.Sound.play("click");
    window.parent.location = arcademics.Settings.endGameURL
}
;
arcademics.ResultsScreen.prototype.printButton_click = function(a) {
    jk.Sound.play("click");
    a = new jk.PrintJob;
    var b = new Date
      , c = new arcademics.Certificate;
    c.scoreText.text = this.getScoreString(this.myPlayer.score, this.scoreType);
    c.accuracyText.text = this.lastGameInstance.accuracy + "%";
    c.rateText.text = this.lastGameInstance.rate + "/min";
    c.gameTitleText.text = this.gameTitle;
    c.dateText.text = this.monthAbbrevs[b.getMonth()] + " " + b.getDate() + " " + b.getFullYear();
    c.trophy.id = "Trophy" + this.myPlayer.place;
    c.playerNameText.text = this.myPlayer.name;
    a.addChild(c);
    a.send()
}
;
this.arcademics = this.arcademics || {};
arcademics.ScreenManager = function() {}
;
arcademics.ScreenManager.init = function(a) {
    this._stage = a;
    a = new jk.Rect(0,0,arcademics.Settings.gameWidth,arcademics.Settings.gameHeight,{
        fill: "#FFFFFF"
    });
    this._stage.addChild(a);
    this._stage.mask = a
}
;
arcademics.ScreenManager.show = function(a) {
    null != this._currentScreen && this._stage.removeChild(this._currentScreen);
    this._currentScreen = new a;
    this._stage.addChild(this._currentScreen)
}
;
this.arcademics = this.arcademics || {};
arcademics.TitleScreen = function() {
    jk.Container.call(this);
    var a = new jk.SVG(arcademics.Settings.backgroundId);
    this.addChild(a);
    a = new jk.SVG(arcademics.Settings.titleId);
    a.ariaLabel = arcademics.Settings.gameTitle;
    this.addChild(a);
    a = new arcademics.PlayButton;
    a.label = arcademics.Locale.loadString("PLAY_BUTTON");
    a.x = 350 - a.width / 2 + 21;
    a.y = 316;
    a.addEventListener(jk.MouseEvent.CLICK, this.playButton_click.bind(this));
    this.addChild(a);
    arcademics.Settings.showCopyright && (a = new jk.Text,
    a.color = arcademics.Settings.copyrightTextColor,
    a.cursor = "pointer",
    a.role = "link",
    a.text = arcademics.Locale.loadString("COPYRIGHT"),
    a.x = 6,
    a.y = 380,
    a.addEventListener(jk.MouseEvent.CLICK, this.copyrightField_click.bind(this)),
    this.addChild(a));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.TitleScreen, jk.Container);
arcademics.TitleScreen.getUID = jk.Container.getUID;
arcademics.TitleScreen._nextUID = jk.Container._nextUID;
arcademics.TitleScreen.prototype.playButton_click = function(a) {
    jk.Sound.resume().then(function() {
        jk.Sound.play("click")
    });
    arcademics.ScreenManager.show(arcademics.PlayerScreen)
}
;
arcademics.TitleScreen.prototype.copyrightField_click = function(a) {
    "Poki" != arcademics.Settings.affiliate && window.parent.open(arcademics.Settings.copyrightURL, "_blank")
}
;
arcademics.TitleScreen.prototype.removedFromStage = function(a) {
    jk.Sound.stopAll();
    jk.Tween.removeAll()
}
;
this.arcademics = this.arcademics || {};
arcademics.Certificate = function() {
    jk.Container.call(this);
    var a = new jk.SVG("CertificateBackground");
    a.x = 30;
    a.y = 30;
    this.addChild(a);
    a = new jk.Text;
    a.color = "#CC0000";
    a.fontFamily = "Arial";
    a.fontSize = 18;
    a.fontStyle = "italic";
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 220;
    a.y = 65;
    this.scoreText = this.addChild(a);
    a = new jk.Text;
    a.color = "#003333";
    a.fontFamily = "Arial";
    a.fontSize = 18;
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 305;
    a.y = 65;
    this.accuracyText = this.addChild(a);
    a = new jk.Text;
    a.color = "#003333";
    a.fontFamily = "Arial";
    a.fontSize = 18;
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 380;
    a.y = 65;
    this.rateText = this.addChild(a);
    a = new jk.Text;
    a.color = "#000000";
    a.fontFamily = "Arial";
    a.fontSize = 24;
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 300;
    a.y = 115;
    this.gameTitleText = this.addChild(a);
    a = new jk.Text;
    a.color = "#666666";
    a.fontFamily = "Arial";
    a.fontSize = 16;
    a.fontStyle = "italic";
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 300;
    a.y = 145;
    this.dateText = this.addChild(a);
    a = new jk.SVG(null);
    a.x = 300;
    a.y = 515;
    this.trophy = this.addChild(a);
    a = new jk.Text;
    a.color = "#4D341C";
    a.fontFamily = "Arial";
    a.fontSize = 24;
    a.fontWeight = "bold";
    a.textAlign = "center";
    a.x = 300;
    a.y = 430;
    this.playerNameText = this.addChild(a);
    a = new jk.SVG("Logo");
    a.scaleX = .5;
    a.scaleY = .5;
    a.x = 45;
    a.y = 535;
    this.addChild(a);
    a = new jk.Text;
    a.color = "#000066";
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.text = "www.arcademics.com";
    a.textAlign = "right";
    a.x = 555;
    a.y = 540;
    this.addChild(a)
}
;
$jscomp.inherits(arcademics.Certificate, jk.Container);
arcademics.Certificate.getUID = jk.Container.getUID;
arcademics.Certificate._nextUID = jk.Container._nextUID;
this.arcademics = this.arcademics || {};
arcademics.CreateGameDialog = function() {
    jk.Container.call(this);
    this.ariaLabelledBy = "createGameHeader";
    this.role = "dialog";
    var a = new jk.Rect(0,0,320,0,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.addChild(a);
    var b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Montserrat, sans-serif";
    b.fontSize = 24;
    b.id = "createGameHeader";
    b.text = arcademics.Locale.loadString("CREATE_GAME");
    b.x = 20;
    b.y = 15;
    this.addChild(b);
    var c = new jk.Text;
    c.color = arcademics.Settings.boxTextColor;
    c.fontFamily = "Arial";
    c.fontSize = 16;
    c.multiline = !0;
    c.text = arcademics.Locale.loadString("CREATE_GAME_DESCRIPTION");
    c.width = 280;
    c.x = 20;
    c.y = b.y + b.height + 8;
    this.addChild(c);
    b = new jk.TextInput;
    b.ariaLabel = arcademics.Locale.loadString("CREATE_GAME_DESCRIPTION");
    b.color = "#000000";
    b.fontFamily = "Arial";
    b.fontSize = 16;
    b.height = 30;
    b.maxLength = 20;
    b.restrict = "A-Za-z0-9 ";
    b.width = 280;
    b.x = 20;
    b.y = c.y + c.height + 20;
    this.passwordField = this.addChild(b);
    c = new arcademics.PrimaryButton;
    c.label = arcademics.Locale.loadString("CREATE_BUTTON");
    c.x = a.width - c.width - 20;
    c.y = b.y + b.height + 20;
    c.addEventListener(jk.MouseEvent.CLICK, this.createButton_click.bind(this));
    this.addChild(c);
    b = new jk.SVG("CloseButton");
    b.ariaLabel = "Close";
    b.cursor = "pointer";
    b.role = "button";
    b.x = a.width - b.width - 10;
    b.y = 10;
    b.addEventListener(jk.MouseEvent.CLICK, this.closeButton_click.bind(this));
    this.addChild(b);
    a.height = c.y + c.height + 20;
    this.addEventListener(jk.Event.ADDED_TO_STAGE, this.addedToStage.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.CreateGameDialog, jk.Container);
arcademics.CreateGameDialog.getUID = jk.Container.getUID;
arcademics.CreateGameDialog._nextUID = jk.Container._nextUID;
arcademics.CreateGameDialog.prototype.reset = function() {
    this.passwordField.text = "";
    this.passwordField.focus()
}
;
arcademics.CreateGameDialog.prototype.addedToStage = function(a) {
    jk.Keyboard.addEventListener(jk.KeyboardEvent.KEY_DOWN, this.keyDownHandler.bind(this))
}
;
arcademics.CreateGameDialog.prototype.closeButton_click = function(a) {
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.CLOSE))
}
;
arcademics.CreateGameDialog.prototype.createButton_click = function(a) {
    jk.Sound.play("click");
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.CREATE_GAME,null,{
        password: this.passwordField.text
    }))
}
;
arcademics.CreateGameDialog.prototype.keyDownHandler = function(a) {
    a.key == jk.Keyboard.ENTER && this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.CREATE_GAME,null,{
        password: this.passwordField.text
    }))
}
;
arcademics.CreateGameDialog.prototype.removedFromStage = function(a) {
    jk.Keyboard.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.ErrorDialog = function() {
    jk.Container.call(this);
    this.ariaLabelledBy = "errorHeader";
    this.ariaDescribedBy = "errorContent";
    this.role = "alertdialog";
    var a = new jk.Rect(0,0,320,140,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.backgroundBox = this.addChild(a);
    var b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Montserrat, sans-serif";
    b.fontSize = 24;
    b.id = "errorHeader";
    b.x = 20;
    b.y = 15;
    this.headerField = this.addChild(b);
    var c = new jk.Text;
    c.color = arcademics.Settings.boxTextColor;
    c.fontFamily = "Arial";
    c.fontSize = 16;
    c.id = "errorContent";
    c.multiline = !0;
    c.width = 280;
    c.x = 20;
    c.y = b.y + b.height + 8;
    this.contentField = this.addChild(c);
    b = new arcademics.SecondaryButton;
    b.label = arcademics.Locale.loadString("OK_BUTTON");
    b.width = 100;
    b.x = a.width - b.width - 20;
    b.y = c.y + c.height + 20;
    b.addEventListener(jk.MouseEvent.CLICK, this.okButton_click.bind(this));
    this.okButton = this.addChild(b);
    c = new jk.SVG("CloseButton");
    c.ariaLabel = "Close";
    c.cursor = "pointer";
    c.role = "button";
    c.x = a.width - c.width - 10;
    c.y = 10;
    c.addEventListener(jk.MouseEvent.CLICK, this.closeButton_click.bind(this));
    this.addChild(c);
    this.addEventListener(jk.Event.ADDED_TO_STAGE, this.addedToStage.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.ErrorDialog, jk.Container);
arcademics.ErrorDialog.getUID = jk.Container.getUID;
arcademics.ErrorDialog._nextUID = jk.Container._nextUID;
arcademics.ErrorDialog.prototype.display = function(a, b) {
    this.headerField.text = a;
    this.contentField.text = b;
    this.contentField.y = this.headerField.y + this.headerField.height + 8;
    this.okButton.y = this.contentField.y + this.contentField.height + 20;
    this.backgroundBox.height = this.okButton.y + this.okButton.height + 20;
    this.okButton.focus()
}
;
arcademics.ErrorDialog.prototype.addedToStage = function(a) {
    jk.Keyboard.addEventListener(jk.KeyboardEvent.KEY_DOWN, this.keyDownHandler.bind(this))
}
;
arcademics.ErrorDialog.prototype.closeButton_click = function(a) {
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.CLOSE))
}
;
arcademics.ErrorDialog.prototype.keyDownHandler = function(a) {
    a.key == jk.Keyboard.ENTER && this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.OK))
}
;
arcademics.ErrorDialog.prototype.okButton_click = function(a) {
    jk.Sound.play("click");
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.OK))
}
;
arcademics.ErrorDialog.prototype.removedFromStage = function(a) {
    jk.Keyboard.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.GameDialog = function() {
    jk.Container.call(this);
    var a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Montserrat, sans-serif";
    a.fontSize = 24;
    a.text = arcademics.Locale.loadString("MULTIPLAYER_LOBBY");
    a.x = 0;
    a.y = 0;
    this.addChild(a);
    a = new arcademics.PrimaryButton;
    a.label = arcademics.Locale.loadString("PLAY_NOW_BUTTON");
    a.y = 0;
    a.addEventListener(jk.MouseEvent.CLICK, this.playNowButton_click.bind(this));
    this.addChild(a);
    var b = new arcademics.SecondaryButton;
    b.label = arcademics.Locale.loadString("CREATE_GAME_BUTTON");
    b.x = 660 - b.width;
    b.y = 2;
    b.addEventListener(jk.MouseEvent.CLICK, this.createGameButton_click.bind(this));
    this.addChild(b);
    a.x = b.x - a.width - 15;
    a = new jk.Rect(0,50,660,310,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.addChild(a)
}
;
$jscomp.inherits(arcademics.GameDialog, jk.Container);
arcademics.GameDialog.getUID = jk.Container.getUID;
arcademics.GameDialog._nextUID = jk.Container._nextUID;
arcademics.GameDialog.prototype.createGameButton_click = function(a) {
    jk.Sound.play("click");
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.CREATE_GAME))
}
;
arcademics.GameDialog.prototype.playNowButton_click = function(a) {
    jk.Sound.play("click");
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.PLAY_NOW))
}
;
this.arcademics = this.arcademics || {};
arcademics.JoinGameDialog = function() {
    jk.Container.call(this);
    this.ariaLabelledBy = "joinGameHeader";
    this.role = "dialog";
    var a = new jk.Rect(0,0,320,0,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.addChild(a);
    var b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Montserrat, sans-serif";
    b.fontSize = 24;
    b.id = "joinGameHeader";
    b.text = arcademics.Locale.loadString("JOIN_GAME");
    b.x = 20;
    b.y = 15;
    this.addChild(b);
    var c = new jk.Text;
    c.color = arcademics.Settings.boxTextColor;
    c.fontFamily = "Arial";
    c.fontSize = 16;
    c.multiline = !0;
    c.text = arcademics.Locale.loadString("JOIN_GAME_DESCRIPTION");
    c.width = 280;
    c.x = 20;
    c.y = b.y + b.height + 8;
    this.addChild(c);
    b = new jk.TextInput;
    b.ariaLabel = arcademics.Locale.loadString("JOIN_GAME_DESCRIPTION");
    b.color = "#000000";
    b.fontFamily = "Arial";
    b.fontSize = 16;
    b.height = 30;
    b.maxLength = 20;
    b.restrict = "A-Za-z0-9 ";
    b.width = 280;
    b.x = 20;
    b.y = c.y + c.height + 20;
    this.passwordField = this.addChild(b);
    c = new arcademics.PrimaryButton;
    c.label = arcademics.Locale.loadString("JOIN_BUTTON");
    c.x = a.width - c.width - 20;
    c.y = b.y + b.height + 20;
    c.addEventListener(jk.MouseEvent.CLICK, this.joinButton_click.bind(this));
    this.addChild(c);
    b = new jk.SVG("CloseButton");
    b.ariaLabel = "Close";
    b.cursor = "pointer";
    b.role = "button";
    b.x = a.width - b.width - 10;
    b.y = 10;
    b.addEventListener(jk.MouseEvent.CLICK, this.closeButton_click.bind(this));
    this.addChild(b);
    a.height = c.y + c.height + 20;
    this.addEventListener(jk.Event.ADDED_TO_STAGE, this.addedToStage.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.JoinGameDialog, jk.Container);
arcademics.JoinGameDialog.getUID = jk.Container.getUID;
arcademics.JoinGameDialog._nextUID = jk.Container._nextUID;
arcademics.JoinGameDialog.prototype.reset = function() {
    this.passwordField.text = "";
    this.passwordField.focus()
}
;
arcademics.JoinGameDialog.prototype.addedToStage = function(a) {
    jk.Keyboard.addEventListener(jk.KeyboardEvent.KEY_DOWN, this.keyDownHandler.bind(this))
}
;
arcademics.JoinGameDialog.prototype.closeButton_click = function(a) {
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.CLOSE))
}
;
arcademics.JoinGameDialog.prototype.joinButton_click = function(a) {
    jk.Sound.play("click");
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.JOIN_GAME,null,{
        password: this.passwordField.text
    }))
}
;
arcademics.JoinGameDialog.prototype.keyDownHandler = function(a) {
    a.key == jk.Keyboard.ENTER && this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.JOIN_GAME,null,{
        password: this.passwordField.text
    }))
}
;
arcademics.JoinGameDialog.prototype.removedFromStage = function(a) {
    jk.Keyboard.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.PlayerDialog = function(a, b, c) {
    jk.Container.call(this);
    this.ariaLabelledBy = "playerHeader";
    this.role = "dialog";
    this.isConnected = a;
    this.clearedOnce = !1;
    this.lastName = b;
    this.lastPosition = 0;
    var d = a ? arcademics.Locale.loadString("NEXT_BUTTON") : arcademics.Locale.loadString("PLAY_OFFLINE_BUTTON")
      , e = new jk.Rect(0,0,320,0,{
        fill: arcademics.Settings.boxBackgroundColor,
        "fill-opacity": arcademics.Settings.boxBackgroundAlpha
    });
    this.addChild(e);
    var f = new jk.Text;
    f.color = arcademics.Settings.boxTextColor;
    f.fontFamily = "Montserrat, sans-serif";
    f.fontSize = 24;
    f.id = "playerHeader";
    f.text = arcademics.Locale.loadString("PLAYER_NAME");
    f.x = 20;
    f.y = 15;
    this.addChild(f);
    var g = new jk.Text;
    g.color = arcademics.Settings.boxTextColor;
    g.fontFamily = "Arial";
    g.fontSize = 16;
    g.multiline = !0;
    g.text = arcademics.Locale.loadString("PLAYER_DESCRIPTION");
    g.width = 280;
    g.x = 20;
    g.y = f.y + f.height + 8;
    this.addChild(g);
    f = g.y + g.height + 20;
    g = new jk.Rect(20,f - 4,280,30,{
        fill: "#FFFFFF",
        stoke: "#000000"
    });
    this.addChild(g);
    g = 0;
    c ? (c = new jk.TextInput,
    c.ariaLabel = arcademics.Locale.loadString("PLAYER_DESCRIPTION"),
    c.color = "#666666",
    c.height = 22) : (c = new jk.Text,
    c.color = "#000000",
    g = 4);
    c.fontFamily = "Arial";
    c.fontSize = 16;
    c.maxLength = 10;
    c.text = b;
    c.width = 276;
    c.x = 22 + g;
    c.y = f;
    c.addEventListener(jk.Event.FOCUS, this.nameField_focus.bind(this));
    c.addEventListener(jk.Event.INPUT, this.nameField_input.bind(this));
    this.nameField = this.addChild(c);
    b = new jk.Text;
    b.color = arcademics.Settings.boxTextColor;
    b.fontFamily = "Arial";
    b.fontSize = 14;
    b.multiline = !0;
    b.role = "alert";
    b.width = 280;
    b.x = 20;
    b.y = f + 30;
    this.errorField = this.addChild(b);
    b = new arcademics.PrimaryButton;
    b.label = d;
    b.x = e.width - b.width - 20;
    b.y = f + 76;
    b.addEventListener(jk.MouseEvent.CLICK, this.nextButton_click.bind(this));
    this.nextButton = this.addChild(b);
    d = b.y + b.height + 20;
    a || (a = new jk.SVG("WarningClip"),
    a.x = 20,
    a.y = f + 133,
    this.addChild(a),
    d = new jk.Text,
    d.color = arcademics.Settings.boxTextColor,
    d.fontFamily = "Arial",
    d.fontSize = 14,
    d.text = arcademics.Locale.loadString("MULTIPLAYER_FAILED"),
    d.x = a.x + a.width + 10,
    d.y = f + 128,
    this.addChild(d),
    d = new jk.Text,
    d.color = arcademics.Settings.boxTextColor,
    d.cursor = "pointer",
    d.fontFamily = "Arial",
    d.fontSize = 14,
    d.text = arcademics.Locale.loadString("WHY_CONNECT"),
    d.textDecoration = "underline",
    d.x = a.x + a.width + 10,
    d.y = f + 148,
    d.addEventListener(jk.MouseEvent.CLICK, this.whyField_click.bind(this)),
    this.addChild(d),
    d = d.y + d.height + 20);
    e.height = d;
    this.addEventListener(jk.Event.ADDED_TO_STAGE, this.addedToStage.bind(this));
    this.addEventListener(jk.Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this))
}
;
$jscomp.inherits(arcademics.PlayerDialog, jk.Container);
arcademics.PlayerDialog.getUID = jk.Container.getUID;
arcademics.PlayerDialog._nextUID = jk.Container._nextUID;
arcademics.PlayerDialog.prototype.addedToStage = function(a) {
    jk.Keyboard.addEventListener(jk.KeyboardEvent.KEY_DOWN, this.keyDownHandler.bind(this))
}
;
arcademics.PlayerDialog.prototype.nameField_focus = function(a) {
    !this.clearedOnce && arcademics.Settings.playerNameEditable && (this.nameField.color = "#000000",
    this.lastName = this.nameField.text = "",
    this.nextButton.enabled = !1,
    this.clearedOnce = !0)
}
;
arcademics.PlayerDialog.prototype.nameField_input = function(a) {
    a = this.nameField.caretIndex;
    this.nameField.text = this.nameField.text.substring(0, 1).toUpperCase() + this.nameField.text.substring(1);
    var b = !0;
    -1 < this.nameField.text.search(/^[^A-Z]/) ? (this.errorField.text = arcademics.Locale.loadString("USERNAME_BEGIN_LETTER"),
    b = !1) : -1 < this.nameField.text.search(/[^A-Za-z0-9]/) ? (this.errorField.text = arcademics.Locale.loadString("USERNAME_ALPHANUMERIC"),
    b = !1) : -1 < this.nameField.text.search(/[0-9]+[A-Za-z]+/) ? (this.errorField.text = arcademics.Locale.loadString("USERNAME_END_NUMBER"),
    b = !1) : -1 < this.nameField.text.search(/[0-9]{7,}/) ? (this.errorField.text = "",
    b = !1) : -1 < this.nameField.text.search(/.{11,}/) ? (this.errorField.text = "",
    b = !1) : (this.errorField.text = "",
    this.lastName = this.nameField.text);
    b || (a += this.lastName.length - this.nameField.text.length,
    this.nameField.text = this.lastName);
    this.nameField.setSelection(a, a);
    this.nextButton.enabled = "" != this.lastName
}
;
arcademics.PlayerDialog.prototype.nextButton_click = function(a) {
    jk.Sound.play("click");
    this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.NEXT,null,{
        playerName: this.lastName
    }))
}
;
arcademics.PlayerDialog.prototype.whyField_click = function(a) {
    "Poki" != arcademics.Settings.affiliate && window.parent.open(arcademics.Settings.connectErrorURL, "_blank")
}
;
arcademics.PlayerDialog.prototype.keyDownHandler = function(a) {
    a.key == jk.Keyboard.ENTER && this.nextButton.enabled && this.dispatchEvent(new arcademics.GenericEvent(arcademics.GenericEvent.NEXT,null,{
        playerName: this.lastName
    }))
}
;
arcademics.PlayerDialog.prototype.removedFromStage = function(a) {
    jk.Keyboard.removeAllEventListeners()
}
;
this.arcademics = this.arcademics || {};
arcademics.LobbySprite4 = function() {
    jk.Container.call(this);
    var a = new jk.Rect(0,0,0,0,{
        fill: "#FFFFFF",
        "fill-opacity": .25
    });
    this.selectedBackground = this.addChild(a);
    a = new jk.SVG(arcademics.Settings.playerIconId);
    this.playerIconClip = this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Arial";
    a.fontSize = 14;
    a.textAlign = "center";
    a.x = 83;
    a.y = 150;
    this.playerNameField = this.addChild(a);
    this.ribbonClip = void 0;
    this._selected = !1;
    this.starsClip = void 0
}
;
$jscomp.inherits(arcademics.LobbySprite4, jk.Container);
arcademics.LobbySprite4.getUID = jk.Container.getUID;
arcademics.LobbySprite4._nextUID = jk.Container._nextUID;
$jscomp.global.Object.defineProperties(arcademics.LobbySprite4.prototype, {
    ribbon: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            arcademics.Settings.isAffiliate || (this.ribbonClip && this.removeChild(this.ribbonClip),
            a && (a = new jk.SVG("Ribbon" + arcademics.StringUtility.capitalize(a)),
            this._selected ? (a.x = 10,
            a.y = 5,
            a.scaleX = 1.12,
            a.scaleY = 1.12) : (a.x = 8,
            a.y = 19),
            this.ribbonClip = this.addChild(a)))
        }
    },
    selected: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this._selected
        },
        set: function(a) {
            (this._selected = a) ? (this.selectedBackground.height = 270,
            this.selectedBackground.visible = !0,
            this.selectedBackground.width = 166,
            this.selectedBackground.y = 0,
            arcademics.DisplayUtility.fit(this.playerIconClip, 15, 15, 136, 120, "center", "bottom"),
            this.playerNameField.fontSize = 16,
            this.playerNameField.fontWeight = "bold",
            this.playerNameField.width = 136,
            this.playerNameField.x = 83,
            this.ribbonClip && (this.ribbonClip.x = 10,
            this.ribbonClip.y = 5,
            this.ribbonClip.scaleX = 1.12,
            this.ribbonClip.scaleY = 1.12),
            this.starsClip && (this.starsClip.scaleX = 1.12,
            this.starsClip.scaleY = 1.12,
            this.starsClip.x = (this.width - this.starsClip.width) / 2)) : (this.selectedBackground.height = 240,
            this.selectedBackground.visible = !1,
            this.selectedBackground.width = 135,
            this.selectedBackground.y = 15,
            arcademics.DisplayUtility.fit(this.playerIconClip, 15, 30, 105, 105, "center", "bottom"),
            this.playerNameField.fontSize = 14,
            this.playerNameField.fontWeight = "normal",
            this.playerNameField.width = 105,
            this.playerNameField.x = 67.5,
            this.ribbonClip && (this.ribbonClip.x = 8,
            this.ribbonClip.y = 19),
            this.starsClip && (this.starsClip.scaleX = 1,
            this.starsClip.scaleY = 1,
            this.starsClip.x = (this.width - this.starsClip.width) / 2))
        }
    },
    starLevel: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            if (!arcademics.Settings.isAffiliate && (this.starsClip && this.removeChild(this.starsClip),
            a)) {
                var b = new jk.Container;
                b.y = 182;
                this.starsClip = this.addChild(b);
                for (var c = 0; c < a; c++) {
                    var d = new jk.SVG("StarClip");
                    d.x = c * (d.width + 2);
                    b.addChild(d)
                }
                b._calcInitDimensions();
                this._selected && (b.scaleX = 1.12,
                b.scaleY = 1.12);
                b.x = (this.width - b.width) / 2
            }
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.LobbySprite12 = function() {
    jk.Container.call(this);
    var a = new jk.SVG(arcademics.Settings.playerIconId);
    arcademics.DisplayUtility.fit(a, 0, 5, 55, 36, "center", "center");
    this.playerIconClip = this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Arial";
    a.fontSize = 16;
    a.width = 135;
    a.x = 60;
    a.y = 13;
    this.playerNameField = this.addChild(a);
    this.ribbonClip = void 0;
    this._selected = !1;
    this.starsClip = void 0
}
;
$jscomp.inherits(arcademics.LobbySprite12, jk.Container);
arcademics.LobbySprite12.getUID = jk.Container.getUID;
arcademics.LobbySprite12._nextUID = jk.Container._nextUID;
$jscomp.global.Object.defineProperties(arcademics.LobbySprite12.prototype, {
    ribbon: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            arcademics.Settings.isAffiliate || (this.ribbonClip && this.removeChild(this.ribbonClip),
            a && (a = new jk.SVG("Ribbon" + arcademics.StringUtility.capitalize(a)),
            a.x = 2,
            a.y = 2,
            a.scaleX = .5,
            a.scaleY = .5,
            this.ribbonClip = this.addChild(a)))
        }
    },
    selected: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {}
    },
    starLevel: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            if (!arcademics.Settings.isAffiliate)
                if (this.starsClip && this.removeChild(this.starsClip),
                a) {
                    var b = new jk.Container;
                    b.x = 62;
                    b.y = 27;
                    this.starsClip = this.addChild(b);
                    for (var c = 0; c < a; c++) {
                        var d = new jk.SVG("StarClip");
                        d.height = 12;
                        d.width = 12;
                        d.x = c * (d.width + 2);
                        b.addChild(d)
                    }
                    this.playerNameField.y = 7
                } else
                    this.playerNameField.y = 13
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.ResultsSprite4 = function() {
    jk.Container.call(this);
    var a = new jk.Rect(0,0,400,70,{
        fill: "#FFFFFF",
        "fill-opacity": .25
    });
    this.selectedBackground = this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Arial";
    a.fontSize = 20;
    a.x = 65;
    a.y = 12;
    this.placeField = this.addChild(a);
    a = new jk.Text;
    a.color = "#FF3366";
    a.fontFamily = "Arial";
    a.fontSize = 16;
    a.x = 65;
    a.y = 38;
    this.scoreField = this.addChild(a);
    a = new jk.SVG(arcademics.Settings.playerIconId);
    arcademics.DisplayUtility.fit(a, 150, 8, 100, 54, "center", "center");
    this.playerIconClip = this.addChild(a);
    a = new jk.Text;
    a.color = arcademics.Settings.backgroundTextColor;
    a.fontFamily = "Arial";
    a.fontSize = 16;
    a.width = 125;
    a.x = 260;
    a.y = 25;
    this.playerNameField = this.addChild(a);
    this.selected = !1
}
;
$jscomp.inherits(arcademics.ResultsSprite4, jk.Container);
arcademics.ResultsSprite4.getUID = jk.Container.getUID;
arcademics.ResultsSprite4._nextUID = jk.Container._nextUID;
$jscomp.global.Object.defineProperties(arcademics.ResultsSprite4.prototype, {
    place: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            3 >= a && (a = new jk.SVG("Trophy" + a),
            a.x = 31,
            a.y = 58.7,
            a.width = 42,
            a.height = 50.7,
            this.addChild(a))
        }
    },
    placeString: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.placeField.text = a
        }
    },
    playerColor: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.playerIconClip.color = a
        }
    },
    playerName: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.playerNameField.text = a
        }
    },
    scoreString: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.scoreField.text = a
        }
    },
    selected: {
        configurable: !0,
        enumerable: !0,
        set: function(a) {
            this.selectedBackground.visible = a
        }
    }
});
this.arcademics = this.arcademics || {};
arcademics.ColorUtility = function() {}
;
arcademics.ColorUtility.colorStringToNumber = function(a) {
    return "string" == typeof a ? parseInt(a.substring(1), 16) : a
}
;
arcademics.ColorUtility.colorNumberToString = function(a) {
    return "number" == typeof a ? "#" + ("00000" + (a | 0).toString(16)).substr(-6) : a
}
;
arcademics.ColorUtility.blendColors = function(a, b, c, d) {
    a = this.colorStringToNumber(a);
    c = this.colorStringToNumber(c);
    var e = 1 - (1 - d) * (1 - b);
    return {
        color: this.colorNumberToString(((c & 16711680) >> 16) * d / e + ((a & 16711680) >> 16) * b * (1 - d) / e << 16 | ((c & 65280) >> 8) * d / e + ((a & 65280) >> 8) * b * (1 - d) / e << 8 | (c & 255) * d / e + (a & 255) * b * (1 - d) / e),
        alpha: e
    }
}
;
arcademics.ColorUtility.blendColorsByPercent = function(a, b, c) {
    c = void 0 === c ? .5 : c;
    a = this.colorStringToNumber(a);
    b = this.colorStringToNumber(b);
    return this.colorNumberToString(65536 * Math.round((a & 16711680) * c / 65536 + (b & 16711680) * (1 - c) / 65536) + 256 * Math.round((a & 65280) * c / 256 + (b & 65280) * (1 - c) / 256) + Math.round((a & 255) * c + (b & 255) * (1 - c)))
}
;
arcademics.ColorUtility.changeColorByHSV = function(a, b, c, d) {
    a = this.colorToHSV(this.colorStringToNumber(a));
    a.H = (a.H + b) % 360;
    0 > a.H && (a.H += 360);
    a.S = Math.min(1, Math.max(0, a.S + c));
    a.V = Math.min(1, Math.max(0, a.V + d));
    return this.hsvToColor(a)
}
;
arcademics.ColorUtility.colorToHSV = function(a) {
    var b = (a & 16711680) / 16711680
      , c = (a & 65280) / 65280;
    a = (a & 255) / 255;
    var d = b
      , e = b;
    c > d && (d = c);
    a > d && (d = a);
    c < e && (e = c);
    a < e && (e = a);
    if (d == e)
        return {
            H: 0,
            S: 0,
            V: d
        };
    var f;
    d == b && c >= a && (f = 60 * (c - a) / (d - e));
    d == b && c < a && (f = 60 * (c - a) / (d - e) + 360);
    d == c && (f = 60 * (a - b) / (d - e) + 120);
    d == a && (f = 60 * (b - c) / (d - e) + 240);
    return {
        H: f,
        S: (d - e) / d,
        V: d
    }
}
;
arcademics.ColorUtility.hsvToColor = function(a) {
    var b = (a.H % 360 + 360) % 360
      , c = a.S;
    a = a.V;
    var d = Math.floor(b / 60) % 6
      , e = b / 60 - d;
    b = a * (1 - c);
    var f = a * (1 - e * c);
    c = a * (1 - (1 - e) * c);
    switch (d) {
    case 0:
        var g = a;
        var h = c;
        var k = b;
        break;
    case 1:
        g = f;
        h = a;
        k = b;
        break;
    case 2:
        g = b;
        h = a;
        k = c;
        break;
    case 3:
        g = b;
        h = f;
        k = a;
        break;
    case 4:
        g = c;
        h = b;
        k = a;
        break;
    case 5:
        g = a,
        h = b,
        k = f
    }
    return this.colorNumberToString(65536 * Math.floor(255 * g) + 256 * Math.floor(255 * h) + Math.floor(255 * k))
}
;
this.arcademics = this.arcademics || {};
arcademics.DisplayUtility = function() {}
;
arcademics.DisplayUtility.align = function(a, b, c, d, e, f, g) {
    var h = a.getRect();
    a.x = "left" == f ? b - h.x * a.width / h.width : "right" == f ? b + d - a.width - h.x * a.width / h.width : b + (d - a.width) / 2 - h.x * a.width / h.width;
    a.y = "top" == g ? c - h.y * a.height / h.height : "bottom" == g ? c + e - a.height - h.y * a.height / h.height : c + (e - a.height) / 2 - h.y * a.height / h.height
}
;
arcademics.DisplayUtility.fit = function(a, b, c, d, e, f, g) {
    var h = d / a.width;
    h * a.height > e && (h = e / a.height);
    a.width *= h;
    a.height *= h;
    this.align(a, b, c, d, e, f, g)
}
;
this.arcademics = this.arcademics || {};
arcademics.RandomUtility = function() {
    throw "RandomUtility cannot be instantiated.";
}
;
arcademics.RandomUtility.getPermutation = function(a) {
    for (var b = [], c = 0; c < a; c++)
        b.splice(Math.floor(Math.random() * (b.length + 1)), 0, c);
    return b
}
;
arcademics.RandomUtility.getRandomElement = function(a) {
    Array.isArray(a) || (a = Object.values(a));
    return a[Math.floor(Math.random() * a.length)]
}
;
arcademics.RandomUtility.partialShuffle = function(a, b) {
    for (var c = [], d = 0; d < a.length; d++)
        c.push({
            rank: Math.random() * b + d,
            value: a[d]
        });
    c.sort(function(a, b) {
        return a.rank - b.rank
    });
    for (d = 0; d < c.length; d++)
        c[d] = c[d].value;
    return c
}
;
arcademics.RandomUtility.permuteArray = function(a, b) {
    b = void 0 === b ? null : b;
    null == b && (b = this.getPermutation(a.length));
    for (var c = [], d = 0; d < b.length; d++)
        c[d] = a[b[d]];
    return c
}
;
arcademics.RandomUtility.randomBoolean = function() {
    return .5 > Math.random()
}
;
arcademics.RandomUtility.randomInteger = function(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a)
}
;
arcademics.RandomUtility.randomFloat = function(a, b, c) {
    return arcademics.Utility.fixPrecision(a + Math.floor((b - a) / c * Math.random()) * c)
}
;
arcademics.RandomUtility.randomSubset = function(a, b) {
    return this.permuteArray(a).slice(0, b)
}
;
arcademics.RandomUtility.removeRandomElement = function(a) {
    var b = Math.floor(Math.random() * a.length)
      , c = a[b];
    a.splice(b, 1);
    return c
}
;
arcademics.RandomUtility.shuffle = function(a) {
    var b, c = [];
    for (b = 0; b < a.length; b++) {
        var d = {};
        d.rank = Math.random();
        d.value = a[b];
        c.push(d)
    }
    c.sort(function(a, b) {
        return a.rank - b.rank
    });
    a = [];
    for (b = 0; b < c.length; b++)
        a.push(c[b].value);
    return a
}
;
this.arcademics = this.arcademics || {};
arcademics.StringUtility = function() {
    throw "StringUtility cannot be instantiated.";
}
;
arcademics.StringUtility.capitalize = function(a) {
    var b = a.slice(0, 1);
    b = b.toUpperCase();
    a = a.slice(1, a.length);
    a = a.toLowerCase();
    return b.concat(a)
}
;
arcademics.StringUtility.commify = function(a) {
    a = String(a);
    a = StringUtility.reverse(a);
    a = a.replace(/(\d\d\d)(?=\d)(?!\d*\.)/, "$1,");
    return reverse(a)
}
;
arcademics.StringUtility.reverse = function(a) {
    return a.split("").reverse().join("")
}
;
this.arcademics = this.arcademics || {};
arcademics.Utility = function() {
    throw "Utility cannot be instantiated.";
}
;
arcademics.Utility.easeToLinearly = function(a, b, c) {
    return a == b ? b : this.snapNumber(a + (b > a ? c : -c), b, c)
}
;
arcademics.Utility.fixPrecision = function(a, b) {
    b = void 0 === b ? 1E6 : b;
    return Math.round(a * b) / b
}
;
arcademics.Utility.gcd = function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (1 >= a || 1 >= b)
        return 1;
    var c = Math.max(a, b);
    for (a = Math.min(a, b); c % a; )
        b = c % a,
        c = a,
        a = b;
    return a
}
;
arcademics.Utility.getArc = function(a, b, c, d, e, f, g) {
    for (var h = [], k = 0; k <= g; k++) {
        var l = e + (f - e) * k / g;
        h.push([a + Math.cos(l) * c, b + Math.sin(l) * d])
    }
    return h
}
;
arcademics.Utility.magnitude = function(a) {
    for (var b = 0, c = 0; c < a.length; c++)
        b += a[c] * a[c];
    return Math.sqrt(b)
}
;
arcademics.Utility.snapNumber = function(a, b, c) {
    return Math.abs(a - b) < c ? b : a
}
;
