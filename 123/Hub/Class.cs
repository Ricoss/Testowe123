using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Chat.Hubs
{


    public class ChatHub : Hub
    {

        public async Task SendMessageToAll(string name, string message)
        {
            await Clients.All.SendAsync("SendMessageToAll", name, message);
        }
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message);
        }

        public Task SendMessageToUser(string name, string connectionId, string message)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveMessage", name, message);
        }
       public async Task JoinRoom (string roomName)
        {
            await Groups.AddToGroupAsync( Context.ConnectionId, roomName);
           // await Clients.Group(roomName).SendAsync(name + " join.");
        }
        public async Task SendMessageGroup (string name , string message, string roomName)
        {
            await Clients.Group(roomName).SendAsync("SendMessageGroup", name, message);
        }
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("UserConnected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync( Exception ex)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }
    }
}

