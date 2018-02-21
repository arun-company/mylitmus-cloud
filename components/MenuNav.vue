<template>
  <div>
     <div data-collapse="all" data-animation="over-left" data-duration="10" data-doc-height="1" class="navbarside w-nav">
       <div class="container w-container">
         <nav role="" class="nav-menu sidebar w-nav-menu">
           <a href="#" title="Close Menu" class="link-block-2 w-inline-block"><img src="~/assets/images/left-arrow-key.png" width="20" height="20"></a>
           <a href="/zone" class="link-block-2 w-inline-block"><img src="~/assets/images/005-dashboard.png" width="20" height="20"><div class="text-block">Dashboard</div></a>
           <a href="#" class="link-block-2 w-inline-block"><img src="~/assets/images/003-signs.png" width="20" height="20"><div class="text-block">Sensor List</div></a>
           <a href="#" class="link-block-2 w-inline-block"><img src="~/assets/images/002-sign.png" width="20" height="20"><div class="text-block">Reporting</div></a>
           <a href="#" class="link-block-2 w-inline-block"><img src="~/assets/images/004-alarm-clock.png" width="20" height="20"><div class="text-block">Settings</div></a>
           <a href="#" class="link-block-2 w-inline-block"><img src="~/assets/images/001-cogwheel.png" width="20" height="20"><div class="text-block">Alarm</div></a>
         </nav>
         <div title="Open Menu" class="menu-button w-nav-button">
           <div class="w-icon-nav-menu"></div>
         </div>

         <div class="div-block">
            <a href="/zone" title="Dashboard" class="link-block w-inline-block"><img src="~/assets/images/005-dashboard.png" width="20" height="20"></a>
            <a href="#" title="Sensor List" class="link-block w-inline-block"><img src="~/assets/images/003-signs.png" width="20" height="20"></a>
            <a href="#" title="Reporting" class="link-block w-inline-block"><img src="~/assets/images/002-sign.png" width="20" height="20"></a>
            <a href="#" title="Alarm" class="link-block w-inline-block"><img src="~/assets/images/004-alarm-clock.png" width="20" height="20"></a>
            <a href="#" title="Settings" class="link-block w-inline-block"><img src="~/assets/images/001-cogwheel.png" width="20" height="20"></a></div>
       </div>
     </div>
     <div data-collapse="none" data-animation="over-right" data-duration="400" class="navbar w-nav">
       <a href="/" class="brand w-nav-brand">
         <div class="text-block-2">Litmus.Cloud</div>
       </a>
       <nav role="navigation" class="nav-menu w-nav-menu"><a href="#" class="nav-link w-nav-link">Sign out</a></nav>
       <div class="menu-button w-nav-button">
         <div class="w-icon-nav-menu"></div>
       </div>
     </div>
    <script>
      Webflow.ready()
    </script>
  </div>
</template>
