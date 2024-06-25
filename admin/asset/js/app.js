$(() => { AdminApp.instance(); });

class AdminApp {
  constructor(options) {
    this.settings = Object.assign({}, options);
    this.ajax = Core.instance().ajax();
    this.session = Core.instance().session();
    this.handleEvent();
    this.handleRefresh();
  }
  static instance(options) {
    return new AdminApp(options);
  }
  static signIn(username, password = '') {
    if (!username) return Promise.reject("Invalid username.");
    this.ajax = Core.instance().ajax();
    return this.ajax.post(`RBACApi/signIn`, {
      username: username,
      password: password
    });
  }
  handleEvent() {
    this.config = Core.instance().config();
    if(this.config.get('sidebarcollapse')) $(".sidebar-panel").addClass('collapsed');
    $(".admin-toggle-sidebar").on("click", (e) => {
      $(".sidebar-panel")
        .one('transitionend', (e) => {
          $(".sidebar-panel").off('transitionend');
          UI.broadcast('sidebar-toggle');
          // console.warn('transition end');
      }).toggleClass("collapsed");
    });
    $(".admin-toggle-sidepanel").on("click", (e) => {
      $(".side-panel").toggleClass("collapsed");
    });
    $("a.has-submenu").on("click", (e) => {
      $(e.currentTarget)
        .next("ul")
        .slideToggle("fast", () => {
          $(e.currentTarget).toggleClass("collapsed");
        });
    });

    $('.bt-app-sign-in').on('click', e => {
      AdminApp.modalSignIn = SignIn.instance({
        remember: true,
        // apps: "kome,moke",
        // rids: "administrator",
        // gids: "lel",
        // redirect: 'some/path'
      }).success((user) => { // console.error(user);
        if (typeof user == "object") {
          this.session.set('user', user).then(() => {  
            UI.success('Sign in successful.').show();
            setTimeout(() => location.reload(), 1000);
          });
        } else UI.error(user).show();
      }).show();
    });

    $('.bt-app-sign-out').on('click', e => {
      // Lang.l('ask-sign-out');
      let confirm = UI.confirm(Lang.l('ask-sign-out')).positive(() => {
        // console.log(Core.instance().config()) 'Do you want to sign out?'
        this.session.get('lang').then(lang => {
          this.session.destroy().then(() => {
            Promise.all(lang ? [this.session.set('lang', lang)] : []).then(() => {
              window.location.href = Core.instance().config('baseurl');
            });
          });
        });
        confirm.hide();
      }).show();
    });

    $('#dd-lang .item-lang').on('click', e => {
      let langCode = $(e.target).data('code');
      let lang = $(e.target).text();
      let currentLangCode = $('#lang-label').attr('data-lang');
      console.log(langCode, currentLangCode);
      if (langCode == currentLangCode) {
        UI.info(`Current language is ${$('#lang-label').text()}.`).show();
      } else {
        let confirm = UI.confirm(`Change the language setting to ${lang}?`)
          .positive(() => {
            this.session.set('core-lang', langCode).then(() => {
              confirm.hide();
              confirm = UI.confirm(`Language setting has been set to ${lang}. Do you want to reload the page to apply the new settings?<br><span class="text-danger">You might lose unsaved work if you reload now.</span>`)
                .positive(() => {
                  location.reload();
                })
                .show();
            });
        }).show();
      }
    });

    let config = Core.instance().config();
    // Auto-activate and auto-collapse menu and menu items
    $('a.submenu-link.active').parents('.has-submenu').find('.nav-link').addClass('active');
    $('a.submenu-link.active').parents('.submenu').addClass('show'); 
    let menu = $(`#menu-${config.get('app')}-${config.get('menu')}`);
    if (menu[0]) menu[0].scrollIntoView({behavior: "smooth", block: "center"});
  }

  handleRefresh() {
    this.session.getAll().then(sessions => {
      let lang = (sessions['core-lang']) ? (sessions['core-lang']) : Core.instance().config('defaultlang');
      $(`#dd-lang .item-lang`).removeClass('text-primary');
      let name = $(`#dd-lang .item-lang[data-code="${lang}"]`).addClass('text-primary').text();
      $('#lang-label').attr('data-lang', lang).html(name);
      // console.log(sessions, name, lang, Core.instance().config());
    });
  }
}
















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

