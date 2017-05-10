/*
 * Bootstrap-based responsive mashup
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);

var config = {
    host: window.location.hostname,
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};
//to avoid errors in workbench: you can remove this when you have added an app
var app;
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

require(["js/qlik"], function (qlik) {

    var control = false;
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + "<br>");
        if (!control) {
            control = true;
            $('#popup').delay(1000).fadeIn(1000).delay(11000).fadeOut(1000);
        }
    });

    $("#closePopup").click(function () {
        $('#popup').hide();
    });
    if ($('ul#qbmlist li').length === 0) {
        $('#qbmlist').append("<li><a>No bookmarks available</a></li>");
    }
    $("body").css("overflow: hidden;");
    function AppUi(app) {
        var me = this;
        this.app = app;
        app.global.isPersonalMode(function (reply) {
            me.isPersonalMode = reply.qReturn;
        });
        app.getAppLayout(function (layout) {
            $("#title").html(layout.qTitle);
            $("#title").attr("title", "Last reload:" + layout.qLastReloadTime.replace(/T/, ' ').replace(/Z/, ' '));
            //TODO: bootstrap tooltip ??
        });
        app.getList('SelectionObject', function (reply) {
            $("[data-qcmd='back']").parent().toggleClass('disabled', reply.qSelectionObject.qBackCount < 1);
            $("[data-qcmd='forward']").parent().toggleClass('disabled', reply.qSelectionObject.qForwardCount < 1);
        });
        app.getList("BookmarkList", function (reply) {
            var str = "";
            reply.qBookmarkList.qItems.forEach(function (value) {
                if (value.qData.title) {
                    str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
                }
            });
            str += '<li><a data-cmd="create">Create</a></li>';
            $('#qbmlist').html(str).find('a').on('click', function () {
                var id = $(this).data('id');
                if (id) {
                    app.bookmark.apply(id);
                } else {
                    var cmd = $(this).data('cmd');
                    if (cmd === "create") {
                        $('#createBmModal').modal();
                    }
                }
            });
        });
        $("[data-qcmd]").on('click', function () {
            var $element = $(this);
            switch ($element.data('qcmd')) {
                //app level commands
                case 'clearAll':
                    app.clearAll();
                    break;
                case 'back':
                    app.back();
                    break;
                case 'forward':
                    app.forward();
                    break;
                case 'lockAll':
                    app.lockAll();
                    break;
                case 'unlockAll':
                    app.unlockAll();
                    break;
                case 'createBm':
                    var title = $("#bmtitle").val(), desc = $("#bmdesc").val();
                    app.bookmark.create(title, desc);
                    $('#createBmModal').modal('hide');
                    break;
            }
        });
    }

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

    //open apps -- inserted here --
    var app = qlik.openApp('874c5da1-995e-46f6-a135-09b886ec809a', config);


    //get objects -- inserted here --


    app.getObject('QV06', '01e1012f-ed08-4664-b8f3-de21ac634926');
    app.getObject('QV05', '621d8d94-707c-43d0-9134-9721472d990a');
    app.getObject('QV02', 'a07899cf-0645-4981-ae55-5588e5c6ab84');

    app.getObject('QV01', '05bd567e-8f54-42fe-b3c9-94e2349c59f3');
    app.getObject('QV04', '97e84ecc-6f7d-43f1-9c87-39e16adc2cae');
    app.getObject('QV03', 'cca2371f-ef7f-434c-b54a-6c83bdb35d03');


    //create cubes and lists -- inserted here --

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

});