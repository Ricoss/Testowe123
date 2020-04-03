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

       public async Task JoinRoom (string name, string roomName)
        {
            await Groups.AddToGroupAsync( name, roomName);
            await Clients.Group(roomName).SendAsync(name + " join.");
        }
        public async Task SendMessageGroup (string name , string message, string roomName)
        {
            await Clients.Group(roomName).SendAsync("SendMessageGroup", name, message);
        }
    }

    //public class ContosoChatHub : Hub
    //{
    //    //public Task JoinRoom(string name, string roomName)
    //    //{
    //    //    return Groups.AddToGroupAsync(name, roomName);
            
    //    //}

    //    //public Task LeaveRoom(string roomName)
    //    //{
    //    //    return Groups.Remove(Context.ConnectionId, roomName);
    //    //}
    //}


}