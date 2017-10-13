/**
 * Theme: Ubold Admin Template
 * Author: Coderthemes
 * Form wizard page
 */

require("jqueryValidate");
require("jquerySteps");
var validFormAction = require("Validform");

var swWizard = {
    defaultOption: {
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft"
    },
    init: function(el, type, option) {
        var _this = this;
        if (option) {
            option = $.extend(true, option, _this.defaultOption);

        }
        var method = new _this.whichKind(type);

        method($(el), option);


    },
    whichKind: function(type) {
        var _this = swWizard;
        switch (type) {
            case 'base':
                return _this.methods.createBasic;
                break;
            case 'validate':
                return _this.methods.createValidatorForm;
                break;
            case 'vertical':
                return _this.methods.createVertical;
                break;
        }

    },
    methods: {
        createBasic: function($form_container, option) {
            $form_container.children("div").steps(option);
            return $form_container;
        },
        createValidatorForm: function($form_container, option) {
            var valid = validFormAction.runByElement($form_container, {}),
                onStepChanging = option.onStepChanging;
            var event_on = {
                onStepChanging: function(event, currentIndex, newIndex) {
                    var $selector, ignoreArr = new Array();
                    $(event.currentTarget).find(option.bodyTag).each(function(index) {

                            var $bodytag=$(this).find('[datatype]').attr("name");
                            if (currentIndex != index) {
                                $(this).find('[datatype]').each(function(_index) {
                                    $selector = $(this);
                                    var name=$selector.attr('name');
                                    if(name)
                                    ignoreArr.push("[name='" + name+"']");
                                })

                            }
                        })
                    if(ignoreArr.length!=0)
                    valid.ignore(ignoreArr.join(','));
                    return  valid.check();
                },
                onStepChanged: function() {
                    valid.unignore();
                },
                onFinishing: function(event, currentIndex) {
                    return valid.check();
                }
            }
            for (var k in event_on) {
                option[k] = event_on[k];
            }
            // if(onStepChanging==="function")
            // {

            //     option.onStepChanging=function(event, currentIndex, newIndex){
            //         onStepChanging(event, currentIndex, newIndex);
            //         return valid.check();
            //     }
            // } else {
            //     option.onStepChanging=event_on.onStepChanging;
            // }
            $form_container.children("div").steps(option);
            // $form_container.children("div").steps({
            //     headerTag: "h3",
            //     bodyTag: "section",
            //     transitionEffect: "slideLeft",
            //     onStepChanging: function(event, currentIndex, newIndex) {
            //         validFormAction.runByElemt
            //     },
            //     onFinishing: function(event, currentIndex) {
            //         $form_container.validate().settings.ignore = ":disabled";
            //         return $form_container.valid();
            //     },
            //     onFinished: function(event, currentIndex) {
            //         alert("Submitted!");
            //     }
            // });

            return $form_container;
        },
        createVertical: function($form_container) {
            $form_container.steps({
                headerTag: "h3",
                bodyTag: "section",
                transitionEffect: "fade",
                stepsOrientation: "vertical"
            });
            return $form_container;
        }
    }
}

// ! function($) {
//     "use strict";

//     var FormWizard = function() {};

//     FormWizard.prototype.createBasic = function($form_container) {
//             $form_container.children("div").steps({
//                 headerTag: "h3",
//                 bodyTag: "section",
//                 transitionEffect: "slideLeft"
//             });
//             return $form_container;
//         },
//         //creates form with validation
//         FormWizard.prototype.createValidatorForm = function($form_container) {
//             $form_container.validate({
//                 errorPlacement: function errorPlacement(error, element) {
//                     element.after(error);
//                 }
//             });
//             $form_container.children("div").steps({
//                 headerTag: "h3",
//                 bodyTag: "section",
//                 transitionEffect: "slideLeft",
//                 onStepChanging: function(event, currentIndex, newIndex) {
//                     $form_container.validate().settings.ignore = ":disabled,:hidden";
//                     return $form_container.valid();
//                 },
//                 onFinishing: function(event, currentIndex) {
//                     $form_container.validate().settings.ignore = ":disabled";
//                     return $form_container.valid();
//                 },
//                 onFinished: function(event, currentIndex) {
//                     alert("Submitted!");
//                 }
//             });

//             return $form_container;
//         },
//         //creates vertical form
//         FormWizard.prototype.createVertical = function($form_container) {
//             $form_container.steps({
//                 headerTag: "h3",
//                 bodyTag: "section",
//                 transitionEffect: "fade",
//                 stepsOrientation: "vertical"
//             });
//             return $form_container;
//         },
//         FormWizard.prototype.init = function() {
//             //initialzing various forms

//             //basic form
//             this.createBasic($("#basic-form"));

//             //form with validation
//             this.createValidatorForm($("#wizard-validation-form"));

//             //vertical form
//             this.createVertical($("#wizard-vertical"));
//         },
//         //init
//         $.FormWizard = new FormWizard, $.FormWizard.Constructor = FormWizard
// }(window.jQuery),

// //initializing 
// function($) {
//     "use strict";
//     $.FormWizard.init()
// }(window.jQuery);


module.exports = swWizard;
