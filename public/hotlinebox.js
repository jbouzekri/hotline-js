(function(window,document){

    var jqLikeLibrary = {
        extend: function(){
            for(var i=1; i<arguments.length; i++)
                for(var key in arguments[i])
                    if(arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
            return arguments[0];
        },

        append: function (el, str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            while (div.children.length > 0)
            {
              el.appendChild(div.children[0]);
            }
        },

        on: function (elem,eventType,handler) {
            if (elem.addEventListener)
            {
                elem.addEventListener (eventType,handler,false);
            }
            else if (elem.attachEvent)
            {
                elem.attachEvent ('on'+eventType,handler);
            }
            else
            {
                throw "Unable to attach event";
            }
        }
    };

    function HotlineBoxManager(options) {
        this.options = {
            host: 'localhost:3000',
            styles: {
                __BASE_CSS__: "position:fixed;right:0px;bottom:0px;z-index:999999;",
                __STW_CSS__: "cursor:pointer;",
                __CHW_CSS__: "display:none;",
                __CL_CSS__: "position:absolute;top:0px;right:0px;width:20px;height:20px;cursor:pointer;"
            }
        },
        this.host = options.host,
        this.id,
        this.template = '\
            <div id="__ID__" style="__BASE_CSS__"> \
                <div class="status-wrapper" style="__STW_CSS__"> \
                    <iframe frameBorder="0" style="pointer-events:none;" allowTransparency="true" class="statusbox" width="300" height="25" src="__STATUS_URL__" onload="document.querySelector(\'#__ID__ .chat-wrapper .chatbox\').setAttribute(\'src\', document.querySelector(\'#__ID__ .chat-wrapper .chatbox\').getAttribute(\'data-src\'));"></iframe> \
                </div> \
                <div class="chat-wrapper" style="__CHW_CSS__"> \
                    <div class="close" style="__CL_CSS__"></div> \
                    <iframe scrolling="no" frameBorder="0" class="chatbox" width="300" data-src="__CHAT_URL__" height="250" allowTransparency="true"></iframe> \
                </div> \
            </div>',

        this.template = options.template || this.template,
        this.options = jqLikeLibrary.extend(this.options, options),

        this.init = function() {
            this.host = options.host || 'localhost:3000';
            this.id = 'hotlinebox_'+Math.random().toString(36).substring(7);

            this.template = this.template.replace(/__ID__/g, this.id);
            this.template = this.template.replace(/__STATUS_URL__/, this.host+'/front/status-box');
            this.template = this.template.replace(/__CHAT_URL__/, this.host+'/front/chat-box');

            this.buildTemplate();

            jqLikeLibrary.append(document.body, this.template);

            this.initEvent();
        },

        this.initEvent = function() {
            var statusWrapper = document.querySelector("#"+this.id+" .status-wrapper");
            var chatWrapper = document.querySelector("#"+this.id+" .chat-wrapper");



            jqLikeLibrary.on(statusWrapper, 'click', function() {
                statusWrapper.style.display = 'none';
                chatWrapper.style.display = 'block';
            });
            jqLikeLibrary.on(chatWrapper, 'click', function() {
                statusWrapper.style.display = 'block';
                chatWrapper.style.display = 'none';
            });
        },

        this.buildTemplate = function() {
            for(var key in this.options.styles) {
                this.template = this.template.replace(new RegExp(key, 'i'), this.options.styles[key]);
            }
        }
    }

    var manager = new HotlineBoxManager(window.hotlinejs);
    manager.init();
}(window,document));