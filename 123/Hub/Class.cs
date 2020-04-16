using _123.Hub;

using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat.Hubs
{


    public class ChatHub : Hub 
    {
       
        private static ConcurrentDictionary<string, User> ChatClients = new ConcurrentDictionary<string, User>();
        private static IList<string> ChatRoom = new List<string>();

        public  ConcurrentDictionary <string, User>  Login (string name)
        {
            User newUser = new User { Name = name, ID = Context.ConnectionId };
            ChatClients.TryAdd(name, newUser);
            return ChatClients;
        }//\/

        public Task SendMessageToUser(string fromName, string toName, string message)
        {
            var nameID = ChatClients.Where(s => s.Key == toName).Select(s => s.Value.ID).First();
            Clients.Client(Context.ConnectionId).SendAsync("SendMessageToUser", fromName, message);
            return Clients.Client(nameID).SendAsync("SendMessageToUser", fromName, message);
        }//\/

        public async Task CreateRoom (string roomName)
        {
            ChatRoom.Add(roomName);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }//\/
        public async Task AddUserRoom(string roomName , string addName)
        {
            var nameID = ChatClients.Where(s => s.Key == addName).Select(s => s.Value.ID).First();
            await Groups.AddToGroupAsync(nameID, roomName);
        }//\/
        public async Task SendMessageGroup (string name , string message, string roomName)
        {
            await Clients.Group(roomName).SendAsync("SendMessageGroup", name, message);
        }

        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);        
        }



        //public async Task Private(string roomName, string name1, string name2)
        //{
        //    ChatRoom chatuser = new ChatRoom { Name1 = name1, Name2 = name2 };
        //    ChatRoom.TryAdd(roomName, chatuser);
        //    var nameID = ChatClients.Where(s => s.Key == name1).Select(s => s.Value.ID).First();
        //    await Groups.AddToGroupAsync( nameID, roomName);
        //    await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        //}
        //public async Task SendMessagePrivate(string name, string message, string roomName , string nameod)
        //{
        //    if (roomName == "")
        //    {
        //    roomName = ChatRoom.Where(s => s.Value.Name1 == name && s.Value.Name2 == nameod).Select(s => s.Key).First();
        //    }
        //    await Clients.Group(roomName).SendAsync("SendMessageGroup", name, message);
        //}

        public async Task RemuweUSerRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
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

