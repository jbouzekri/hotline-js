(function(window,document){

    var jqLikeLibrary = {
        append: function (el, str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            while (div.children.length > 0)
            {
              el.appendChild(div.children[0]);
            }
        },

        get: function(url, callback) {
            var xhr = this.createXHR();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4)
                {
                    callback(xhr.responseText);
                }
            };
            xhr.open('GET', url, true);
            xhr.send();
        },

        createXHR: function () {
            var xhr;
            if (window.ActiveXObject)
            {
                try
                {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch(e)
                {
                    throw "Unable to create an XHR object";
                    xhr = null;
                }
            }
            else
            {
                xhr = new XMLHttpRequest();
            }

            return xhr;
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

    function HotlineBoxManager(host) {
        this.host = host,

        this.init = function() {
            var object = this;
            jqLikeLibrary.get(this.host+'/hotline-box', function(data) {
                jqLikeLibrary.append(document.body, data);
                object.initEvent();
            });
        },

        this.initEvent = function() {
            var state = document.querySelector("#hotline-js .state");
            var chat = document.querySelector("#hotline-js .chat");

            jqLikeLibrary.on(state, 'click', function() {
                state.style.display = 'none';
                chat.style.display = 'block';
            });
            jqLikeLibrary.on(chat, 'click', function() {
                state.style.display = 'block';
                chat.style.display = 'none';
            });
        }
    }

    var manager = new HotlineBoxManager(window.hotlinejs.host);
    manager.init();
}(window,document));