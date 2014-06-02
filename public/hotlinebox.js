(function(window,document){


    var HotlineBoxManager = function() {

    }
console.log(window.hotlinejs);
    function createXHR()
    {
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

    var xhr = createXHR();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4)
        {
            alert(xhr.responseText);
        }
    };
    xhr.open('GET', window.hotlinejs.host+'/hotline-box', true);
    xhr.send();

    var manager = new HotlineBoxManager();
}(window,document));