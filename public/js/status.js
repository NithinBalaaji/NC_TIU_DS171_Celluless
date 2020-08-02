$(".steps").on("click", ".step--active", function () {
  $(this).removeClass("step--incomplete").addClass("step--complete");
  $(this).removeClass("step--active").addClass("step--inactive");
  $(this).next().removeClass("step--inactive").addClass("step--active");
});

$(".steps").on("click", ".step--complete", function () {
  $(this).removeClass("step--complete").addClass("step--incomplete");
  $(this).removeClass("step--inactive").addClass("step--active");
  $(this).nextAll().removeClass("step--complete").addClass("step--incomplete");
  $(this).nextAll().removeClass("step--active").addClass("step--inactive");
});

