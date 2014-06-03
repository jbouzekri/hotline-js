(function(window,document){

    var jqLikeLibrary = {
        append: function (el, str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            while (div.children.length > 0) {
              el.appendChild(div.children[0]);
            }
        },

        get: function(url, callback) {
            var xhr = this.createXHR();
            xhr.onreadystatechange = function()
            {
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
                    alert(e.message);
                    xhr = null;
                }
            }
            else
            {
                xhr = new XMLHttpRequest();
            }

            return xhr;
        }
    };

    function HotlineBoxManager(host) {
        this.host = host,

        this.init = function() {
            jqLikeLibrary.get(this.host+'/hotline-box', function(data) {
                jqLikeLibrary.append(document.body, data);
            });
        }
    }

    var manager = new HotlineBoxManager(window.hotlinejs.host);
    manager.init();
}(window,document));