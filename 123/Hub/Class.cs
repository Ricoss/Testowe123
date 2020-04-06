using _123.Hub;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Collections.Generic;
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

        public Task SendMessageToUser(string connectionId, string message)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
        }







       public async Task JoinRoom (string name, string roomName)
        {
            await Groups.AddToGroupAsync( name, roomName);
           // await Clients.Group(roomName).SendAsync(name + " join.");
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

