(function ($) {
    
    let searchPlayers = $('#searchPlayers'),
        searchInput = $('#show_search_term'),
        searchError = $('#formError'),
        reportType = $('#reportType'),
        otherReportReason = $("#otherReportReason"),
        successMessage = $('#successMessage');
        submitButton = $('#submitButton')

    searchPlayers.submit((e) => {
        e.preventDefault();

        let searchTerm = searchInput.val().trim();
        if(searchTerm.trim().length === 0) {
            successMessage.hide();
            searchError.text('Error: player name may not be empty');
        } else {
            searchError.text('');
            
            let reportData = {reportType: reportType.val().trim()};

            if (reportType.val() === 'reasonOther') {
                reportData.reportDesc = otherReportReason.val().trim();
            }

            $.ajax({
                method: 'POST', 
                url: '/report-player', 
                contentType: 'application/json',
                data: JSON.stringify({reportedPlayer: searchTerm, reportData: reportData}),
                success: function(response) {
                    console.log(response);
                    successMessage.show();
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log(xhr);
                    var err = eval("(" + xhr.responseText + ")");
                    successMessage.hide();
                    searchError.text(err.error);
                }
            })
        }
    })

})(window.jQuery);

