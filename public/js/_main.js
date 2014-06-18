// Main JS file

jQuery(document).ready(function($)	{
	
	$('.nav-btn').click(function()	{
		$('.mobile-nav').toggleClass('active');
		$('.wrapper').toggleClass('nav-open');
	});	

	$(document).ready(function() {
	    $.ajaxSetup({
	        'beforeSend' : function() {
	            $('.ajax-loader').addClass('show');
	        },
	    'complete'   : function() {
	            $('.ajax-loader').removeClass('show');
	        }
	    });
	});	

	$.ajaxSetup({cache:false});		

	$('.progress').waypoint({
		offset: 650,
		triggerOnce: true,
		handler: function() {
	  		$('.progress-bar').removeClass('hidden').addClass('animate');
		}
	});	

    var client_id = '61fd47803f24406b92fe0e18a1f6bc4e';
    var user_id = '18514242';
    var count = 6;
    var url = 'https://api.instagram.com/v1/users/' + user_id + '/media/recent?client_id=' + client_id + '&count=' + count + '&callback=?';

    $.getJSON( url, function(data)   {
        $.each( data.data, function(index, value)	{
        	var img = '<a href="' + value.link + '" class="feed-item" target="_blank">';

        	img += '<img src="' + value.images.low_resolution.url + '" />';
        	img += '</a>';

        	$('.collage').prepend(img);

        });

    });  	
 	
});