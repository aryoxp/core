<?php $this->view('head.php', null, CoreView::CORE); ?>
<?php 
  $lang = array();
  $lang[] = "Willkommen!";
  $lang[] = "Bienvenido!";
  $lang[] = "Bienvenue!";
  $lang[] = "Benvenuto!";
  $lang[] = "Bem-vindo!";
  $lang[] = "Välkommen!";
  $lang[] = "Hoş geldin!";
  $lang[] = "Witaj!";
  $lang[] = "Selamat datang!";
  $lang[] = "Добро пожаловать!";
  $lang[] = "欢迎!";
  $lang[] = "أهلا بك!";
  $lang[] = "ողջույն!";
  $lang[] = "ကြိုဆို!";
  $lang[] = "欢迎!";
  $lang[] = "მისასალმებელი!";
  $lang[] = "ברוך הבא!";
  $lang[] = "स्वागत हे!";
  $lang[] = "ようこそ!";
  $lang[] = "ಸ್ವಾಗತಾರ್ಹ!";
  $lang[] = "환영!";
  $lang[] = "тавтай морилно уу!";
  $lang[] = "स्वागत!";
  $lang[] = "خوش آمدی!";
  $lang[] = "පිළිගැනීමේ!";
  $lang[] = "வரவேற்பு!";
  $lang[] = "Hosgeldiniz!";
  $lang[] = "خوش آمدید!";
  $lang[] = "Xush Lelibsiz!";
  $lang[] = "Chào Mừng!";
  $welcome = $lang[rand(0, count($lang)-1)];
?>

<div class="container p-3 flex-fill d-flex flex-column">
  <div class="row flex-fill d-flex flex-column justify-content-center">
    <div class="col-auto mt-3">
    <h1 class="text-secondary display-4"><?php echo $welcome; ?></h1>
    <img src="<?php echo $this->asset('images/mgm.png'); ?>" style="width:300px;" alt="MGM: Media, Game, and Mobile Laboratory" />
    </div>
    <div class="col-auto my-5">
      <a href="<?php echo $this->location('../admin'); ?>" type="button" class="btn btn-lg btn-secondary">Enter &rsaquo;</a>
    </div>
  </div>
  <div class="row border-top p-3">
    <div class="col-auto flex-fill d-flex justify-content-between">
      <span>&copy; <?php echo date('Y'); ?> Media, Game, and Mobile Laboratory.<br>All rights reserved.</span>
      <span class="text-end">
      <a href="https://filkom.ub.ac.id">Faculty of Computer Science</a>.<br>
      <a href="https://ub.ac.id">Universitas Brawijaya</a>.
      </span>
    </div>
  </div>
</div>

<?php $this->view('foot.php', null, CoreView::CORE);