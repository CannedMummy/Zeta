<html xmlns='http://www.w3.org/1999/xhtml'
      xmlns:data='http://www.google.com/2005/gml/data'
      xmlns:b='http://www.google.com/2005/gml/b'
      {{--xmlns:expr='http://www.google.com/2005/gml/expr'--}}>
   <head>
      <title id="page-title">
         <b:if cond='data:blog.pageType == "static_page" or data:blog.pageType == "item"'>
            <data:blog.pageName/>
            -
            <data:blog.pageTitle/>

            <b:else/>

            <data:blog.pageTitle/>

         </b:if>
      </title>


      <b:skin><![CDATA[
         ]]>
      </b:skin>
   </head>

   <body>
      @yield('content')
   </body>
</html>