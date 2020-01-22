var Gpio = require('pigpio').Gpio,
ledRed = new Gpio(4, {mode: Gpio.OUTPUT}),
ledGreen = new Gpio(17, {mode: Gpio.OUTPUT}),
ledBlue = new Gpio(27, {mode: Gpio.OUTPUT}),
redRGB = 0,
greenRGB = 0,
blueRGB = 0;

ledRed.digitalWrite(0);
ledGreen.digitalWrite(0);
ledBlue.digitalWrite(0);

var count = 0;
var max = 256000;
var division = parseInt(max / 3);
while (1) {

    if (count < division) {
        redRGB = parseInt(count / max * 255);
        greenRGB = 0;
        blueRGB = 0;
    } else if (count < division * 2) {
        redRGB = 0;
        greenRGB = parseInt((count - division) / (division*2 - division) * 255);
        blueRGB = 0;
    } else {
        redRGB = 0;
        greenRGB = 0;
        blueRGB = parseInt((count - division*2) / (max - division*2) * 255);
    }

    ledRed.pwmWrite(redRGB);
    ledGreen.pwmWrite(greenRGB);
    ledBlue.pwmWrite(blueRGB);

    count++;
    count = count % max;
}

process.on('SIGINT', function() {
    ledRed.digitalWrite(0);
    ledGreen.digitalWrite(0);
    ledBlue.digitalWrite(0);
    process.exit();
});
