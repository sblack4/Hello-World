using System;
using System.Windows;
using Awesomium.Core;
using System.Diagnostics;

namespace AwesomiumTester {
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window {
        bool IsBrowserLoaded = false;
        string address;

        public MainWindow() {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e) {
            //sends browser to address
            address = "https://reports.carahsoft.com/grid/jong/index.html";
            webControl.Source = new Uri(address);

            // adds function to ConsoleMessage event that prints the messages
            webControl.ConsoleMessage += delegate (object senderThis, ConsoleMessageEventArgs eThis) {
                Debug.WriteLine("Console.log >>> \n  Message: " + eThis.Message + " \n  EventName: " + eThis.EventName + " \n  EventType: " + eThis.EventType + "\n  LineNumber: " + eThis.LineNumber + " \n  Source: " + eThis.Source + " \nEND");

            };
            //handles link clicks
            webControl.ShowCreatedWebView += OnShowNewView;

            txtAddress.Text = address;

            //just sets the window's title to the title tag in the html
            webControl.TitleChanged += OnTitleChanged;

        }

        private void OnTitleChanged(object sender, TitleChangedEventArgs e) {
            if (this.Title != e.Title) {
                this.Title = e.Title;
            }
        }
        internal static void OnShowNewView(object sender, ShowCreatedWebViewEventArgs e) {
            Debug.Write("\n " + e.ToString());
            System.Diagnostics.Process.Start(e.TargetURL.ToString());
        }


        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e) {

        }

        private void browser_DocumentReady(object sender, Awesomium.Core.DocumentReadyEventArgs e) {


        }

        private void OnLoadingFrameComplete(object sender, FrameEventArgs e) {

            if (!IsBrowserLoaded) { 
                using (JSObject myGlobalObject = webControl.CreateGlobalJavascriptObject("myGlobalObject")) {
                    myGlobalObject.Bind("onLinkClicked", JSHandler);
                }
                IsBrowserLoaded = true;
                Debug.WriteLine("browserLoaded", IsBrowserLoaded.ToString());

                // Bound to Javascript event on MindMap
                //browserLoaded();
            }

        }

        /// <summary>
        /// binds events to DOM elements and calls C# functions when js function is called
        /// </summary>
        public void browserLoaded() {
            if (IsBrowserLoaded == true) {
                JSObject emailTelepathButton = webControl.ExecuteJavascriptWithResult("document.getElementById('emailTelepath')");
                emailTelepathButton.BindAsync("onEmailTelepathButtonClick", onEmailTelepathButtonClick);

                JSObject phoneTelepathButton = webControl.ExecuteJavascriptWithResult("document.getElementById('phoneTelepath')");
                phoneTelepathButton.BindAsync("onPhoneTelepathButtonClick", onPhoneTelepathButtonClick);
            }
        }
        private void onEmailTelepathButtonClick(object sender, JavascriptMethodEventArgs args) {
            Debug.WriteLine(args.Arguments[0].ToString());
            JSObject msEvent = args.Arguments[0];
        }
        private void onPhoneTelepathButtonClick(object sender, JavascriptMethodEventArgs args) {
            Debug.WriteLine(args.Arguments[0].ToString());
            JSObject msEvent = args.Arguments[0];
        }


        private JSValue JSHandler(object sender, JavascriptMethodEventArgs args) {
            Process IEProc = new Process();
            IEProc.StartInfo.FileName = "iexplore.exe";
            IEProc.StartInfo.Arguments = args.Arguments[0];
            IEProc.Start();

            Debug.WriteLine("### href = " + args.Arguments[0]);

            return string.Empty;
        }
    }
}
