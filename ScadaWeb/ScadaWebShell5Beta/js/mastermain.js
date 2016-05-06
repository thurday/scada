﻿var scada = scada || {};
scada.env = scada.env || {};

scada.masterMain = {
    // The left pane, which displays tool windows, is expanded
    leftPaneExpanded: true,

    // Update layout of the master page
    updateLayout: function () {
        var divMainHeader = $("#divMainHeader");
        var divMainLeftPane = $("#divMainLeftPane");
        var divMainTabs = $("#divMainTabs");

        var paneH = $(window).height() - divMainHeader.outerHeight();
        divMainLeftPane.outerHeight(paneH);
        divMainTabs.outerWidth(paneH);
        $("#divMainContent").outerHeight(paneH);
    },

    // Choose a tool window according to the current URL and activate it
    chooseToolWindow: function () {
        var rootPath = scada.env.rootPath;
        var explorerVisible = rootPath && rootPath + "View.aspx" == window.location.pathname;

        if (explorerVisible) {
            this.activateToolWindow($("#divMainExplorerTab"));
        } else {
            this.activateToolWindow($("#divMainMenuTab"));
        }
    },

    // Make the tool window, that corresponds a clicked tab, visible
    activateToolWindow: function (divClickedTab) {
        // highlight clicked tab
        var tabs = $("#divMainTabs .tab");
        tabs.removeClass("selected");
        divClickedTab.addClass("selected");

        // deactivate all the tool windows
        var toolWindows = $("#divMainLeftPane .tool-window");
        toolWindows.css("display", "none");

        // activate the appropriate tool window
        var clickedTabId = divClickedTab.attr('id');
        var toolWindow;

        if (clickedTabId == "divMainMenuTab") {
            toolWindow = $("#divMainMenu")
        } else if (clickedTabId == "divMainExplorerTab") {
            toolWindow = $("#divMainExplorer")
        } else {
            toolWindow = null;
        }

        if (toolWindow) {
            toolWindow.css("display", "block");
        }
    },

    // Hide the left pane
    hideLeftPane: function () {
        $("#divMainLeftPane").css("display", "none");
        $("body").css("padding-left", "0");
    },

    // Show the left pane
    showLeftPane: function () {
        $("body").css("padding-left", "");
        $("#divMainLeftPane").css("display", "");
    },

    // Collapse the left pane and show the menu button
    collapseLeftPane: function () {
        $("#spanMainShowMenuBtn").css("display", "inline-block");
        this.hideLeftPane();
        this.leftPaneExpanded = false;
    },

    // Expand the left pane and hide the menu button
    expandLeftPane: function () {
        this.showLeftPane();
        $("#spanMainShowMenuBtn").css("display", "none");
        this.leftPaneExpanded = true;
    },

    // Hide the page header
    hideHeader: function () {
        $("#divMainHeader").css("display", "none");
        $("body").css("padding-top", "0");
    },

    // Show the page header
    showHeader: function () {
        $("#divMainHeader").css("display", "");
        $("body").css("padding-top", "");
    },

    // Hide all the menus and switch browser to fullscreen mode
    switchToFullscreen: function () {
        if (this.leftPaneExpanded) {
            this.hideLeftPane();
        }
        this.hideHeader();
        $("#lblMainNormalViewBtn").css("display", "inline-block");
        scada.utils.requestFullscreen();
    },

    // Show all the menus and exit browser fullscreen mode
    switchToNormalView: function () {
        $("#lblMainNormalViewBtn").css("display", "none");
        if (this.leftPaneExpanded) {
            this.showLeftPane();
        }
        this.showHeader();
        scada.utils.exitFullscreen();
    }
};

$(document).ready(function () {
    scada.masterMain.updateLayout();
    scada.masterMain.chooseToolWindow();
    scada.treeView.prepare();

    // update layout on window resize
    $(window).resize(function () {
        scada.masterMain.updateLayout();
    });

    // activate a tool window if the tab is clicked
    $("#divMainTabs .tab").click(function () {
        scada.masterMain.activateToolWindow($(this));
    });

    // collapse the left pane on the button click
    $("#divMainCollapsePane").click(function () {
        scada.masterMain.collapseLeftPane();
    });

    // expand the left pane on the button click
    $("#spanMainShowMenuBtn").click(function () {
        scada.masterMain.expandLeftPane();
    });

    // switch to full screen mode on the button click
    $("#lblMainFullscreenBtn").click(function () {
        scada.masterMain.switchToFullscreen();
    });

    // switch to normal view mode on the button click
    $("#lblMainNormalViewBtn").click(function () {
        scada.masterMain.switchToNormalView();
    });

    // show menus if user exits fullscreen mode
    $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange", function () {
        if (!scada.utils.isFullscreen()) {
            scada.masterMain.switchToNormalView();
        }
    });
});