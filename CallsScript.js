let absolutePath = "Calls20170105.csv";
d3.csv(absolutePath, function (err, data) {
    if (err) {
        console.warn(err);
        alert("error");
    } else {
        console.log("main, data >>> ", data);
    }
});

