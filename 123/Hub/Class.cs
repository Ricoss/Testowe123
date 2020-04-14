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
        public List<User> Login(string name)
        {
            if (!ChatClients.ContainsKey(name))
            {
                List<User> users = new List<User>(ChatClients.Values);
                User newUser = new User { Name = name, ID = Context.ConnectionId };
                var added = ChatClients.TryAdd(name, newUser);
                if (!added)
                    return null;
                return users;
            }
            return null;
        }
        public async Task SendMessageToAll(string name, string message)
        {
            await Clients.All.SendAsync("SendMessageToAll", name, message);
        }
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message);
        }

        public Task SendMessageToUser(string name, string connect, string message)
        {
            return Clients.Client(connect).SendAsync("ReceiveMessage", name, message);
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

public interface IClient
{
    void ParticipantLogin(User client);
}