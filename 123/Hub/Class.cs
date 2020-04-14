using _123.Hub;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chat.Hubs
{


    public class ChatHub : Hub 
    {
        private static ConcurrentDictionary<string, User> ChatClients = new ConcurrentDictionary<string, User>();
        private static ConcurrentDictionary<string, User> ChatRoom = new ConcurrentDictionary<string, User>();
 
        //public async Task SendMessageToAll(string name, string message)
        //{
        //    await Clients.All.SendAsync("SendMessageToAll", name, message);
        //}
        //public Task SendMessageToCaller(string message)
        //{
        //    return Clients.Caller.SendAsync("ReceiveMessage", message);
        //}

        //public Task SendMessageToUser(string name, string connect, string message)
        //{
        //    return Clients.Client(connect).SendAsync("ReceiveMessage", name, message);
        //}
       public async Task JoinRoom (string roomName)
        {
            await Groups.AddToGroupAsync( Context.ConnectionId, roomName);
        }
        public async Task SendMessageGroup (string name , string message, string roomName)
        {
            await Clients.Group(roomName).SendAsync("SendMessageGroup", name, message);
        }

        public  ConcurrentDictionary <string, User>  Login (string name)
        {
            User newUser = new User { Name = name, ID = Context.ConnectionId };
            ChatClients.TryAdd(name, newUser);
            return ChatClients;
        }
        public  async Task OnConnectedAsync( string name )
        {
            await Clients.All.SendAsync("OnConnectedAsync", Context.ConnectionId);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync( Exception ex)
        {
            await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }
    }
}

public interface IClient
{
    void ParticipantLogin(User client);
}