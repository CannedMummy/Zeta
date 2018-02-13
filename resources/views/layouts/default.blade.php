<html xmlns='http://www.w3.org/1999/xhtml'
      xmlns:data='http://www.google.com/2005/gml/data'
      xmlns:b='http://www.google.com/2005/gml/b'
      {{--xmlns:expr='http://www.google.com/2005/gml/expr'--}}
      ng-app="MainApp">
   <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta charset="UTF-8"/>

      <title id="page-title">
         <b:if cond='data:blog.pageType == "static_page" or data:blog.pageType == "item"'>
            <data:blog.pageName/>
            -
            <data:blog.pageTitle/>

            <b:else/>

            <data:blog.pageTitle/>

         </b:if>
      </title>

      <link rel="stylesheet" href="{{ config('constants.release_host_file') }}/css/angular-material.min.css"/>

      <b:skin><![CDATA[
         ]]>
      </b:skin>
   </head>

   <body ng-cloak>
      @yield('content')

      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/angular.min.js"></script>
      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/angular-animate.min.js"></script>
      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/angular-aria.min.js"></script>
      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/angular-messages.min.js"></script>
      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/angular-sanitize.min.js"></script>
      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/angular-material.min.js"></script>

      <script type="text/javascript" src="{{ config('constants.release_host_file') }}/js/jquery-3.3.1.min.js"></script>
   </body>
</html>