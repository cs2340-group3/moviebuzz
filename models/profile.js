<link href="public/vendor/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css" rel="stylesheet">
<script src="public/vendor/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js"></script>

$('#username').editable({
    type: 'text',
    pk: 1,
    url: '/post',
    title: 'Enter username'

});