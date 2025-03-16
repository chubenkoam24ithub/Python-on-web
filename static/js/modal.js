$(document).ready(function() {
	
    $('#showRegister').click(function(e) {
        e.preventDefault();
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    });
	
    $('#showLogin').click(function(e) {
        e.preventDefault();
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
    });
});