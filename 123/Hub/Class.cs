using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Chat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string name, string message)
        {
            await Clients.All.SendAsync("SendMessage", name, message);
        }
    }

}