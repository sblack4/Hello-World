/*
 * Bootstrap-based responsive mashup
 * SEB
 */
var config = {
    host: 'qlik.carahsoft.com',
    prefix: '/',
    port: 80,
    isSecure: false
};

require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});
var qlikApps = [];

require(["js/qlik"], function (qlik) {
    qlik.setOnError(function (error) {
        {
            alert(error.message);
        }
    });
    function attach(elem) {
        {
            var appid = elem.dataset.qlikAppid;
            var objid = elem.dataset.qlikObjid;
            var app = qlikApps[appid];
            if (!app) {
                {
                    app = qlik.openApp(appid, config);
                    qlikApps[appid] = app;
                }
            }
            app.getObject(elem, objid);
        }
    }
    var elems = document.getElementsByClassName('qlik-embed');
    var ix = 0;
    for (; ix < elems.length; ++ix) {
        {
            attach(elems[ix]);
        }
    }
    /*
    //callbacks -- inserted here --
    function RepList(reply, app) {
        $("#fieldList").empty();
        var qObject = reply.qListObject;
        $.each(qObject.qDataPages[0].qMatrix, function () {
            var item = this[0];
            var selT = "";
            if (item.qState == "S") {
                currentReg = item.qText;
                selT = " style=\"font-weight:bold;\"";
            }
            $("#fieldList").append("<li" + selT + ">" + item.qText + "</li>");
        });

        $("#fieldList li").click(function () {
            app.field("[UserName]").selectMatch($(this).text(), false);
        });
    }
    //create cubes and lists -- inserted here --
    //Open app
    var app = qlik.openApp('1f3acbf0-3a06-4879-882f-8114c26ca597', config);
    if (app) {
        new AppUi(app);
    }
    app.createList({
        "qFrequencyMode": "V",
        "qDef": {
            "qFieldDefs": [
                    "[UserName]"
            ]
        },
        "qExpressions": [],
        "qInitialDataFetch": [
				{
				    "qHeight": 200,
				    "qWidth": 1
				}
        ],
        "qLibraryId": null
    }, RepList);
    */
});
$("#sp").click(function () {
    console.log("Clicked")
});