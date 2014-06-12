window.jwm = (function ($) {

    var jwm = {
        template: ' \
<div class="window panel panel-default"> \
  <div class="panel-heading">Panel heading without title</div> \
  <div class="panel-body"> \
    Panel content \
  </div> \
</div>',

        createWindow: function () {
            var jWin = $(this.template);
            jWin.resizable();
            jWin.draggable();
            $('body').append(jWin);
        }
    };

    return jwm;
}(jQuery));