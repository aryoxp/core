class App {
  constructor(options) {
    this.settings = Object.assign({}, options);
    this.ajax = Core.instance().ajax();
    this.session = Core.instance().session();
    App.ajax = this.ajax;
    this.handleEvent();
    this.onLoad();
  }
  handleEvent() {
    $('#change-password').on('click', '.bt-hide-unhide', (e) => {
      let type = $(e.currentTarget).siblings('input').attr('type');
      // console.log(type, $(e.currentTarget).siblings('input'));
      $(e.currentTarget).find('i.bi')
        .addClass(type == 'password' ? 'bi-eye-slash-fill' : 'bi-eye-fill')
        .removeClass(type == 'password' ? 'bi-eye-fill' : 'bi-eye-slash-fill');
      $(e.currentTarget)
        .siblings('input')
        .attr('type', type == 'text' ? 'password' : 'text');
    });
    $('form#change-password').on('submit', e => {
      e.preventDefault();
      let username = $('input.input-username').val().trim();
      let currentPassword = $('input.input-current-pass').val().trim();
      let password = $('input.input-pass').val().trim();
      let passwordAgain = $('input.input-pass-again').val().trim();
      // console.log(username, currentPassword, password, passwordAgain);

      if (password.length == 0) {
        CUI.error('Password cannot be empty.').show();
        return;
      }
      if (passwordAgain != password) {
        CUI.error('Password and Password (Again) does not match.').show();
        return;
      }

      App.changePassword(username, password, currentPassword)
        .then(result => { // console.log(result);
          if (result) {
            $('input.input-current-pass').val('');
            $('input.input-pass').val('');
            $('input.input-pass-again').val('');
            CUI.info('Password has been updated!').show();
          } else {
            CUI.info('Password has not been updated.<br>Wrong current password or the new password is the same with current password.').show();
          }
      }, err => CUI.error(err).show());

    });
  }

  onLoad() {
    // App.listRegisteredApps();
  }

  static changePassword(username, password = '', oldPassword = '') {
    if (!username) return Promise.reject("Invalid username.");
    this.ajax = Core.instance().ajax();
    return this.ajax.post(`settingsApi/updatePassword`, {
      username: username,
      password: password,
      oldPassword: oldPassword
    });
  }
}

$(() => new App());


















// 'use strict';

// /* ===== Enable Bootstrap Popover (on element  ====== */

// var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="popover"]'))
// var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
//   return new bootstrap.Popover(popoverTriggerEl)
// })

// /* ==== Enable Bootstrap Alert ====== */
// var alertList = document.querySelectorAll('.alert')
// alertList.forEach(function (alert) {
//   new bootstrap.Alert(alert)
// });


// /* ===== Responsive Sidepanel ====== */
// const sidePanelToggler = document.getElementById('sidepanel-toggler'); 
// const sidePanel = document.getElementById('app-sidepanel');  
// const sidePanelDrop = document.getElementById('sidepanel-drop'); 
// const sidePanelClose = document.getElementById('sidepanel-close'); 

// window.addEventListener('load', function(){
// 	responsiveSidePanel(); 
// });

// window.addEventListener('resize', function(){
// 	responsiveSidePanel(); 
// });


// function responsiveSidePanel() {
//     let w = window.innerWidth;
// 	if(w >= 1200) {
// 	    // if larger 
// 	    //console.log('larger');
// 		sidePanel.classList.remove('sidepanel-hidden');
// 		sidePanel.classList.add('sidepanel-visible');
		
// 	} else {
// 	    // if smaller
// 	    //console.log('smaller');
// 	    sidePanel.classList.remove('sidepanel-visible');
// 		sidePanel.classList.add('sidepanel-hidden');
// 	}
// };

// sidePanelToggler.addEventListener('click', () => {
// 	if (sidePanel.classList.contains('sidepanel-visible')) {
// 		console.log('visible');
// 		sidePanel.classList.remove('sidepanel-visible');
// 		sidePanel.classList.add('sidepanel-hidden');
		
// 	} else {
// 		console.log('hidden');
// 		sidePanel.classList.remove('sidepanel-hidden');
// 		sidePanel.classList.add('sidepanel-visible');
// 	}
// });



// sidePanelClose.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	sidePanelToggler.click();
// });

// sidePanelDrop.addEventListener('click', (e) => {
// 	sidePanelToggler.click();
// });



// /* ====== Mobile search ======= */
// const searchMobileTrigger = document.querySelector('.search-mobile-trigger');
// const searchBox = document.querySelector('.app-search-box');

// searchMobileTrigger.addEventListener('click', () => {

// 	searchBox.classList.toggle('is-visible');
	
// 	let searchMobileTriggerIcon = document.querySelector('.search-mobile-trigger-icon');
	
// 	if(searchMobileTriggerIcon.classList.contains('fa-search')) {
// 		searchMobileTriggerIcon.classList.remove('fa-search');
// 		searchMobileTriggerIcon.classList.add('fa-times');
// 	} else {
// 		searchMobileTriggerIcon.classList.remove('fa-times');
// 		searchMobileTriggerIcon.classList.add('fa-search');
// 	}
	
		
	
// });


// $(() => {

//   let cfg = Core.instance().config();
//   let app = cfg.get('app');
//   let controller = cfg.get('controller');
//   let method = cfg.get('method');

//   // Auto-activate and auto-collapse menu and menu items
//   // Below: not defined in the menu.json file
//   $(`.nav-link.menu-${app}-${controller}-${method}`).addClass('active');
//   $(`a.submenu-link.menu-${app}-${controller}-${method}`).addClass('active');
//   // Below: defined in the menu.json file
//   $('a.submenu-link.active').parents('.has-submenu').find('.nav-link').addClass('active');
//   $('a.submenu-link.active').parents('.submenu').addClass('show');
  
//   if ($('a.submenu-link.active').length) {
//     let scroll = $('a.submenu-link.active').position().top - $('#app-nav-main').height()/2;
//     $('#app-nav-main').animate({ // animate navigation scroll
//       scrollTop: scroll // to the position of the target active menu
//     }, 200); 
//   }

//   // let dialog = new CoreWindow('.card', { draggable: true, width: '400px' })
//   // dialog.show();
//   // let dialog = new CoreInfo("Hello! This is an info for the dialog. Nice and thank you!", {
//   //   title: 'Lorem Ipsum Dolor Sit Amet',
//   //   positive: () => {
//   //   alert("Yahoo!");
//   // }}).negative(() => {
//   //   alert("Negative!");
//   // }).title('Ganti!').show();
//   // let dialog = new CoreConfirm("Hello! This is an info for the dialog. Nice and thank you!");
//   // dialog.show();
//   // console.log(dialog);
// });

