=== Adapter Widget Rows ===
Contributors: ryankienstra
Donate link: http://jdrf.org/get-involved/ways-to-donate/
Tags: widgets, Bootstrap, mobile, responsive, sidebars
Requires at least: 4.0
Tested up to: 4.0 
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Drag and drop widgets into horizontal rows. Looks good on any screen.

== Description ==

* Must have Twitter Bootstrap 3 and Glyphicons.
* Drag and drop 1-6 widgets in each horizontal row.
* Easy: each widget has a button to edit, add, delete.
* Build an entire page with widgets.
* Approve changes before publishing them.
* Works with themes "evolve," "Unite," and "DevDmBootstrap3."
* Works with "Openstrap," but icons are unclear.

[youtube https://www.youtube.com/watch?v=xIAAr8MLpJ0]

== Installation ==

1. Upload the adapter-widget-rows directory to your /wp-content/plugins directory.
1. In the "Plugins" menu, find "Adapter Widget Rows," and click "Activate."
1. Click "Settings," "New Page."
1. Give the page a title that isn't used in your theme.
1. Click "Save Changes."
1. Exit the admin menu and go to the page on your site.
1. You will see a button to add a new widget.

== Frequently Asked Questions ==

= What does this require? =

Twitter Bootstrap 3, Glyphicons, and WordPress 4.0

= Will everyone see the bar and icons at the top of every widget? =

No, only administrators, or those with 'manage_options' capabilities. But you can change this by using the filter 'awr_capability_to_edit_widgets'

= I don't need all 6 of the rows on the page. What can I do? =

You and other administrators are the only ones who will see empty rows. Still, you can change the number of rows on a page by entering this in your functions.php file:
  `add_filter( 'awr_amount_of_sidebars_on_page' , 'my_awr_sidebar_count' ) ;
  function my_awr_sidebar_count( $count ) {
    return 3 ; // or your number
  }`

= I accidentally deleted my page "Widget Rows" page in the settings page. How do I get it back? =

In the "Widget Rows" settings page, click "New Page," and type the name of the old page. If you don't remember the name of the page, find its name the admin menu by going to "Pages" > "Trash."

= Can anything else go on my "Adapter Widget Rows" page? =

No. You'll only see your header, footer, and widget rows. But you may create your own template and use the filter 'awr_template_path.' 

== Screenshots ==

1. Drag and drop widgets in the row, or move them to another row. 
2. After you activate the plugin, click the "Settings" link. Then name your new "Widget Row" page(s).
3. Click to add a new widget. 
4. Choose your widget. 
5. Widgets resize to fill the screen. Use 1 to 4 in each row.
6. The widgets stack on mobile displays. 
6. Build your page with widgets. 
7. Drag and drop widgets.  

== Changelog ==

= 1.0.0 =
* First version

== Upgrade Notice ==

* N/A, first version

