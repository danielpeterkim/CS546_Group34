(function ($) {
    let taskArea = $('#task-area')
    function bindEventstoTask(task) {
      task.find('.finishTask').on('click', function (event) {
        event.preventDefault();
        let currentLink = $(this);
        let currentName = currentLink.data('id')

        let requestConfig = {
            method: 'POST',
            url: '/auth_routes/tasks/complete/' + currentId
          };
        $.ajax(requestConfig).then(function (responseMessage) {
          let newElement = $(responseMessage);
          bindEventstoTask(newElement);
          task.replaceWith(newElement);
        });
      });
    }
  
    //When the page loads, we want to bind all the events to the returned data
    taskArea.children().each(function (index, element) {
      bindEventstoTask($(element));
    });
  })(window.jQuery);
  