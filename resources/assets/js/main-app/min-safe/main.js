var
    app = angular.module('mainApp', ['ngCookies', 'ngSanitize']);

app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}]);

var
    showMainLoader = function () {
        $('#main-loader, #main-loader >  .preloader-wrapper').addClass('active');
    },
    hideMainLoader = function () {
        $('#main-loader, #main-loader >  .preloader-wrapper').removeClass('active');
    },
    printError = function (response) {
        var
            message = 'Error: ';

        if (response.hasOwnProperty('exception')) {
            message = message + response.data.exception;
        }

        message = message + '\n' + response.data.message;

        alert(message);
    };

$(document).ready(function () {
    $('.modal').modal();

    $('ul.tabs').tabs();

    $('select').material_select();

    var
        clipboard = new Clipboard(document.querySelectorAll('.btn-clipboard'));

    //clipboard.on('success', function (e) {
    //    console.log(e);
    //});
    clipboard.on('error', function (e) {
        console.log(e);
    });

    //--

    $('a[title="Hosted on free web hosting 000webhost.com. Host your own website for FREE."]').parent().remove();
});
app.controller('vocabularyController', ['$scope', '$filter', '$http', '$cookies', function ($scope, $filter, $http, $cookies) {
    var
        toastTimeout = 2000;

    $scope.currentGroupId = -1;

    $scope.learnData = {};

    $scope.updateCurrentGroupId = function () {
        var
            result = $scope.groups.filter(function (group) {
                return group.id === $scope.currentGroupId;
            });

        if (result.length > 0) {
            $scope.setCurrentGroupId(result[0].id);

            return result[0];
        } else {
            if ($scope.groups.length > 0) {
                $scope.setCurrentGroupId($scope.groups[0].id);

                return $scope.groups[0];
            } else {
                $scope.setCurrentGroupId(-1);

                $scope.getVocabularies();
            }
        }

        return null;
    }

    $scope.setCurrentGroupId = function (id) {
        if ($scope.currentGroupId !== id) {
            $scope.currentGroupId = id;

            $scope.getVocabularies();
        }
    }

    $scope.loadCookies = function () {
        var
            expireDate = new Date();

        expireDate.setDate(expireDate.getDate() + 365);

        //--

        if (!$scope.addVocabularyData) {
            $scope.addVocabularyData = {};
        }

        $scope.addVocabularyData.continue = $cookies.get('addVocabularyData.continue');

        if ($scope.addVocabularyData.continue === undefined) {
            $scope.addVocabularyData.continue = true;

            $cookies.put('addVocabularyData.continue',
                $scope.addVocabularyData.continue, { 'expires': expireDate });
        } else {
            $scope.addVocabularyData.continue = ($scope.addVocabularyData.continue == 'true');
        }

        //--

        $scope.learnData.count = $cookies.get('learnData.count');

        if ($scope.learnData.count === undefined) {
            $scope.learnData.count = 10;

            $cookies.put('learnData.count',
                $scope.learnData.count, { 'expires': expireDate });
        } else {
            $scope.learnData.count = parseInt($scope.learnData.count);
        }
    }

    $scope.loadCookies();

    $scope.saveCookies = function () {
        var
            expireDate = new Date();

        expireDate.setDate(expireDate.getDate() + 365);

        //--

        $cookies.put('addVocabularyData.continue',
            $scope.addVocabularyData.continue, { 'expires': expireDate });

        //--

        $cookies.put('learnData.count',
            $scope.learnData.count, { 'expires': expireDate });
    }

    //--

    $scope.getAllGroups = function () {
        showMainLoader();

        $http.post('api/vocabulary/all-groups', null)
            .then(function (response) {
                $scope.groups = response.data.items;

                hideMainLoader();

                $scope.updateCurrentGroupId();

                $scope.getVocabularies();
            },
            function (response) {
                printError(response);

                hideMainLoader();
            });
    };

    $scope.onClickRefreshGroupsButton = function () {
        $scope.getAllGroups();
    };

    $scope.getAllGroups();

    //--

    $scope.resetCreateGroupForm = function () {
        $scope.createGroupData.name = '';

        var
            $form = $('#create-group-form');

        $form.validate().resetForm();
        $form.find('.error').removeClass('error');
        $form.find('.valid').removeClass('valid');
    }

    $scope.suggestGroupName = function (data) {
        var
            today = new Date(),
            dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = dd + '/' + mm + '/' + yyyy;

        data.name = today;
    }

    $scope.createGroup = function () {
        if ($('#create-group-form').valid()) {
            showMainLoader();

            var
                data = {
                    name: $scope.createGroupData.name
                };

            $http.post('api/vocabulary/create-group', JSON.stringify(data))
                .then(function (response) {
                    $scope.groups = response.data.items;

                    hideMainLoader();

                    $('#create-group-modal').modal('close');

                    var
                        group = response.data.item;

                    Materialize.toast(group.name + ' was created', toastTimeout);
                },
                function (response) {
                    printError(response);

                    hideMainLoader();

                    $('#create-group-modal').modal('close');
                });
        }
    };

    $scope.onClickCreateGroupButton = function () {
        $scope.resetCreateGroupForm();

        $('#create-group-modal').modal('open');
    };

    //--

    $scope.resetUpdateGroupForm = function (group) {
        $scope.updateGroupData.name = group.name;

        var
            $form = $('#update-group-form');

        $form.validate().resetForm();
        $form.find('.error').removeClass('error');
        $form.find('.valid').removeClass('valid');
    }

    $scope.updateGroup = function () {
        if ($('#update-group-form').valid()) {
            showMainLoader();

            var
                data = {
                    id: $scope.currentGroupId,
                    name: $scope.updateGroupData.name
                };

            $http.post('api/vocabulary/update-group', JSON.stringify(data))
                .then(function (response) {
                    $scope.groups = response.data.items;

                    hideMainLoader();

                    $('#update-group-modal').modal('close');

                    var
                        group = response.data.item;

                    Materialize.toast(group.name + ' was updated', toastTimeout);
                },
                function (response) {
                    printError(response);

                    hideMainLoader();

                    $('#update-group-modal').modal('close');
                });
        }
    };

    $scope.onClickUpdateGroupButton = function () {
        var
            result = $scope.groups.filter(function (group) {
                return group.id === $scope.currentGroupId;
            });

        if (result.length > 0) {
            $scope.resetUpdateGroupForm(result[0]);

            $('#update-group-modal').modal('open');
        }
    };

    //--

    $scope.deleteGroup = function () {
        if ($scope.currentGroupId !== -1) {
            showMainLoader();

            var
                data = {
                    id: $scope.currentGroupId
                };

            $http.post('api/vocabulary/delete-group', JSON.stringify(data))
                .then(function (response) {
                    $scope.groups = response.data.items;

                    hideMainLoader();

                    $('#confirm-delete-modal').modal('close');

                    var
                        group = response.data.item;

                    Materialize.toast(group.name + ' was deleted', toastTimeout);

                    $scope.updateCurrentGroupId();
                },
                function (response) {
                    printError(response);

                    hideMainLoader();

                    $('#confirm-delete-modal').modal('close');
                });
        }
    }

    $scope.onClickDeleteGroupButton = function () {
        var
            result = $scope.groups.filter(function (group) {
                return group.id === $scope.currentGroupId;
            });

        if (result.length > 0) {
            $scope.deleteOperation = $scope.deleteGroup;

            $('#confirm-delete-modal').modal('open');
        }
    };

    //--

    $scope.resetAddVocabularyForm = function () {
        $scope.addVocabularyData.vocabulary = '';
        $scope.addVocabularyData.mean = '';
        $scope.addVocabularyData.pronunciation = '';
        $scope.addVocabularyData.sound = '';

        var
            $form = $('#add-vocabulary-form');

        $form.validate().resetForm();
        $form.find('.error').removeClass('error');
        $form.find('.valid').removeClass('valid');
    }

    $scope.onClickAddVocabularyButton = function () {
        var
            result = $scope.groups.filter(function (group) {
                return group.id === $scope.currentGroupId;
            });

        if (result.length > 0) {
            $scope.resetAddVocabularyForm();

            $('#add-vocabulary-modal').modal('open');
        }
    };

    $scope.addVocabulary = function () {
        if ($('#add-vocabulary-form').valid()) {
            showMainLoader();

            var
                data = {
                    group_id: $scope.currentGroupId,
                    vocabulary: $scope.addVocabularyData.vocabulary,
                    mean: $scope.addVocabularyData.mean,
                    pronunciation: $scope.addVocabularyData.pronunciation,
                    sound: $scope.addVocabularyData.sound
                };

            $http.post('api/vocabulary/add', JSON.stringify(data))
                .then(function (response) {
                    if ($scope.addVocabularyData.continue) {
                        hideMainLoader();

                        $scope.resetAddVocabularyForm();
                    } else {
                        hideMainLoader();

                        $('#add-vocabulary-modal').modal('close');
                    }

                    var
                        vocabulary = response.data.item;

                    $scope.getVocabularies();

                    Materialize.toast(vocabulary.vocabulary + ' was created', toastTimeout);
                },
                function (response) {
                    printError(response);

                    hideMainLoader();
                });
        }
    };

    $scope.getVocabularies = function () {
        if ($scope.currentGroupId !== -1) {
            showMainLoader();

            var
                data = {
                    groupId: $scope.currentGroupId
                };

            $http.post('api/vocabulary/get-vocabularies', JSON.stringify(data))
                .then(function (response) {
                    $scope.vocabularies = response.data.items;

                    hideMainLoader();

                    $scope.updateCurrentGroupId();
                },
                function (response) {
                    printError(response);

                    hideMainLoader();
                });
        } else {
            $scope.vocabularies = null;
        }
    };

    $scope.playSound = function (vocabulary) {
        if (vocabulary.sound !== '') {
            var
                audio = new Audio(vocabulary.sound);

            audio.play();
        }
    };

    //--

    $scope.resetUpdateVocabularyForm = function (vocabulary) {
        $scope.updateVocabularyData.id = vocabulary.id;
        $scope.updateVocabularyData.vocabulary = vocabulary.vocabulary;
        $scope.updateVocabularyData.mean = vocabulary.mean;
        $scope.updateVocabularyData.pronunciation = vocabulary.pronunciation;
        $scope.updateVocabularyData.sound = vocabulary.sound;

        var
            $form = $('#update-vocabulary-form');

        $form.validate().resetForm();
        $form.find('.error').removeClass('error');
        $form.find('.valid').removeClass('valid');
    }

    $scope.onClickUpdateVocabulary = function (vocabulary) {
        $scope.resetUpdateVocabularyForm(vocabulary);

        $('#update-vocabulary-modal').modal('open');
    }

    $scope.updateVocabulary = function () {
        if ($('#update-vocabulary-form').valid()) {
            showMainLoader();

            var
                data = {
                    id: $scope.updateVocabularyData.id,
                    vocabulary: $scope.updateVocabularyData.vocabulary,
                    mean: $scope.updateVocabularyData.mean,
                    pronunciation: $scope.updateVocabularyData.pronunciation,
                    sound: $scope.updateVocabularyData.sound
                };

            $http.post('api/vocabulary/update', JSON.stringify(data))
                .then(function (response) {
                    hideMainLoader();

                    $('#update-vocabulary-modal').modal('close');

                    var
                        vocabulary = response.data.item;

                    $scope.getVocabularies();

                    Materialize.toast(vocabulary.vocabulary + ' was updated', toastTimeout);
                },
                function (response) {
                    printError(response);

                    hideMainLoader();
                });
        }
    };

    //--

    $scope.deleteVocabulary = function (vocabulary) {
        if ($scope.currentGroupId !== -1) {
            showMainLoader();

            var
                data = {
                    id: vocabulary.id
                };

            $http.post('api/vocabulary/delete', JSON.stringify(data))
                .then(function (response) {
                    var
                        item = response.data.item;

                    Materialize.toast(item.vocabulary + ' was deleted', toastTimeout);

                    var
                        index = $scope.vocabularies.indexOf(vocabulary);

                    $scope.vocabularies.splice(index, 1);

                    hideMainLoader();
                },
                function (response) {
                    printError(response);

                    hideMainLoader();
                });
        }
    }

    $scope.googleTranslate = function (vocabulary, target) {
        showMainLoader();

        var
            data = {
                input: vocabulary
            };

        $http.post('api/vocabulary/google-translate', JSON.stringify(data))
            .then(function (response) {
                if (target === 'add') {
                    $scope.addVocabularyData.mean = response.data.result;
                } else if (target === 'update') {
                    $scope.updateGroupData.mean = response.data.result;
                } else {
                    target = response.data.result;
                }

                hideMainLoader();
            },
            function (response) {
                printError(response);

                hideMainLoader();
            });
    }

    //--

    $scope.setLearnVocabulary = function () {
        var
            index = Math.floor(Math.random() * $scope.learnData.vocabularies.length),
            vocabulary = $scope.learnData.vocabularies[index];

        $scope.learnData.currentVocabulary = $scope.learnData.vocabularies[index];

        $scope.learnData.vocabularies[index].count -= 1;

        if ($scope.learnData.vocabularies[index].count <= 0) {
            $scope.learnData.vocabularies.splice(index, 1);
        }

        $scope.learnData.vocabulary = '';

        setTimeout(function () {
            $scope.playSound($scope.learnData.currentVocabulary);
        }, 300);
    }

    $scope.suggestVocabulary = function () {
        var
            result = '',
            index = 0,
            vocabulary = $scope.learnData.vocabulary,
            targetVocabulary = $scope.learnData.currentVocabulary.vocabulary;

        if (vocabulary.length > 0) {
            var
                min = Math.min(vocabulary.length, targetVocabulary.length);

            for (index = 0; index < min; index++) {
                var
                    a = vocabulary.charAt(index).toLowerCase(),
                    b = targetVocabulary.charAt(index).toLowerCase();

                if (a === b) {
                    result += vocabulary.charAt(index);
                }
                else {
                    break;
                }
            }
        }

        if (targetVocabulary.charAt(index) !== '') {
            result += targetVocabulary.charAt(index);
        }

        $scope.learnData.vocabulary = result;

        var
            element = $("#learn_data_vocabulary"),
            length = result.length;

        element.selectionStart = length;
        element.selectionEnd = length;
        element.focus();
    }

    $scope.validateVocabulary = function () {
        var
            vocabulary = $scope.learnData.vocabulary.toLowerCase(),
            targetVocabulary = $scope.learnData.currentVocabulary.vocabulary.toLowerCase();

        if (vocabulary === targetVocabulary) {
            Materialize.toast('<span class="correct">Correct</span>', toastTimeout);

            if ($scope.learnData.vocabularies.length > 0) {
                $scope.setLearnVocabulary();
            } else {
                $('#learn-modal').modal('close');
            }
        } else {
            Materialize.toast('<span class="wrong">Wrong</span>', toastTimeout);
        }
    }

    //--

    $scope.onClickLearnButton = function (vocabulary) {
        $('#config-learn-modal').modal('open');
    }

    $scope.learn = function () {
        $scope.learnData.vocabularies = $scope.vocabularies.filter(function (vocabulary) {
            return vocabulary.selected === true;
        });

        if ($scope.learnData.vocabularies.length > 0) {
        } else if ($scope.vocabularies.length > 0) {
            $scope.learnData.vocabularies = $scope.vocabularies;
        }

        if ($scope.learnData.vocabularies.length > 0) {
            for (i = 0; i < $scope.learnData.vocabularies.length; i++) {
                $scope.learnData.vocabularies[i].selected = false;

                $scope.learnData.vocabularies[i].count = $scope.learnData.count;
            }

            $scope.setLearnVocabulary();

            $('#learn-modal').modal('open');

            $('#config-learn-modal').modal('close');
        }
    }
}]);

$(document).ready(function () {
    $('#main-menu-button').sideNav({
        menuWidth: 240,
        edge: 'left',
        closeOnClick: false,
        draggable: false,
        onOpen: function (element) {
            $('#page-content').addClass('collapsed');
        },
        onClose: function (elementel) {
            $('#page-content').removeClass('collapsed');
        }
    });

    $('#create-group-form').validate({
        rules: {
            name: {
                required: true
            }
        },
        messages: {
            name: {
                required: 'Please enter the group name'
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');

            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });

    //--

    $('#update-group-form').validate({
        rules: {
            name: {
                required: true
            }
        },
        messages: {
            name: {
                required: 'Please enter the group name'
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');

            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });

    //--

    $('#add-vocabulary-modal').modal({
        dismissible: true,
        opacity: 0.5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '10%',
        endingTop: '10%',
        ready: function (modal, trigger) {
            $('#add-vocabulary-form').find('ul.tabs').tabs('select_tab', 'add-vocabulary-tab-1')
        },
        complete: function () {
        }
    });

    $('#add-vocabulary-form').validate({
        rules: {
            vocabulary: {
                required: true
            },
            mean: {
                required: true
            }
        },
        messages: {
            vocabulary: {
                required: 'Please enter the vocabulary'
            },
            mean: {
                required: 'Please enter the meaning'
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');

            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });

    //-

    $('#update-vocabulary-modal').modal({
        dismissible: true,
        opacity: 0.5,
        inDuration: 300,
        outDuration: 200,
        startingTop: '10%',
        endingTop: '10%',
        ready: function (modal, trigger) {
            $('#update-vocabulary-form').find('ul.tabs').tabs('select_tab', 'add-vocabulary-tab-1')
        },
        complete: function () {
        }
    });

    $('#update-vocabulary-form').validate({
        rules: {
            vocabulary: {
                required: true
            },
            mean: {
                required: true
            }
        },
        messages: {
            vocabulary: {
                required: 'Please enter the vocabulary'
            },
            mean: {
                required: 'Please enter the meaning'
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');

            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });
});