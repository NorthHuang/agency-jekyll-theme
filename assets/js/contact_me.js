---
---
$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
	  var url = "https://formspree.io/" + "{% if site.formspree_form_path %}{{ site.formspree_form_path }}{% else %}{{ site.email }}{% endif %}";
      var name = $("input#name").val();
      var email = $("input#email").val();
      var phone = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      $this = $("#sendMessageButton");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
      grecaptcha.ready(function () {
        grecaptcha.execute("{{ site.google_recaptcha_site_key }}", { action: 'submit' }).then(function (token) {
          // Add token to the form data
          var formData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            "g-recaptcha-response": token, // Include ReCAPTCHA token
          };

          // AJAX request
          $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: formData,
            cache: false,
            success: function () {
              // Success message
              $('#success').html("<div class='alert alert-success'>");
              $('#success > .alert-success')
                  .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                  .append("</button>");
              $('#success > .alert-success').append("<strong>Your message has been sent. </strong>");
              $('#success > .alert-success').append('</div>');

              // Clear all fields
              $('#contactForm').trigger("reset");
            },
            error: function () {
              // Fail message
              $('#success').html("<div class='alert alert-danger'>");
              $('#success > .alert-danger')
                  .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                  .append("</button>");
              $('#success > .alert-danger').append($("<strong>").text("Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!"));
              $('#success > .alert-danger').append('</div>');

              // Clear all fields
              $('#contactForm').trigger("reset");
            },
            complete: function () {
              setTimeout(function () {
                $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
              }, 1000);
            },
          });
        });
      });
    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});
