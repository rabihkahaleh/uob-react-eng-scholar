<%@ Page Language="C#" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
protected void Page_Load(object sender, EventArgs e)
{
    string endpoint = Request.QueryString["endpoint"];
    if (string.IsNullOrEmpty(endpoint))
    {
        Response.StatusCode = 400;
        Response.Write("Missing endpoint parameter");
        return;
    }

    // Enable TLS 1.2 (required for most HTTPS servers)
    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

    string url = "https://scholarhub.balamand.edu.lb/rest" + endpoint;

    try
    {
        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
        req.Accept = "application/xml";
        req.Timeout = 60000;
        req.UserAgent = "UOB-ScholarHub-Proxy";

        using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
        using (StreamReader reader = new StreamReader(resp.GetResponseStream()))
        {
            Response.ContentType = "application/xml";
            Response.Write(reader.ReadToEnd());
        }
    }
    catch (WebException ex)
    {
        Response.StatusCode = 502;
        Response.ContentType = "text/plain";
        if (ex.Response != null)
        {
            Response.Write("Remote server returned: " + ((HttpWebResponse)ex.Response).StatusCode);
        }
        else
        {
            Response.Write("Could not reach remote server: " + ex.Message);
        }
    }
    catch (Exception ex)
    {
        Response.StatusCode = 500;
        Response.ContentType = "text/plain";
        Response.Write("Proxy error: " + ex.GetType().Name + " - " + ex.Message);
    }
}
</script>
