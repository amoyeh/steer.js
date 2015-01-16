var showBox2dDebug = false;

/* runClassLoader() only used in making this project */
function runClassLoader() {
    var loader = new steer.ClassLoader("../src/");
    loader.load(function () {
        initScene();
    });
}

function generalControls(timer, units) {

    document.getElementById("btnShowBox2d").addEventListener("click", function (e) {
        if (!showBox2dDebug) {
            document.getElementById("box2dDrawCanvas").style.display = "block";
            this.value = "Hide Box2d Debug";
        } else {
            document.getElementById("box2dDrawCanvas").style.display = "none";
            this.value = "Show Box2d Debug";
        }
        showBox2dDebug = !showBox2dDebug;
    });
    document.getElementById("rangeIntegrate").addEventListener("input", function (e) {
        document.getElementById("rangeIntegrateTxt").innerText = e.target.value + " FPS";
        timer.updateTPS(parseInt(e.target.value));
    });

}

function wrapUnitCenter(units) {
    for (var k = 0; k < units.length; k++) {
        var target = units[k];
        var pos = target.getSteerPosition();
        if (pos.x < 0 || pos.x > 1024 || pos.y < 0 || pos.y > 660) target.setSteerPosition(512, 330);
    }
}

function wrapUnit(target) {
    var pos = target.getSteerPosition();
    if (pos.x < 0) {
        target.setSteerPosition(1023, pos.y);
    }
    if (pos.x > 1024) {
        target.setSteerPosition(0, pos.y);
    }
    if (pos.y < 0) {
        target.setSteerPosition(pos.x, 659);
    }
    if (pos.y > 660) {
        target.setSteerPosition(pos.x, 0);
    }
}

