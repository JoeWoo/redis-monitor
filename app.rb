require 'rubygems'
# require 'sinatra'
# require 'json'
require 'thread'
require File.expand_path("../redis_monitor", __FILE__)

require 'em-websocket'

EM.run {
  EM::WebSocket.run(:host => "localhost", :port => 8080, :debug => false) do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      tmp = RedisMonitor.new
      Thread.new{
      		tmp.run_every_n_second(10,10, ws)
      }


    }

    ws.onclose { puts "Connection closed" }

    ws.onmessage { |msg|
      puts "Recieved message: #{msg}"
      ws.send "Pong: #{msg}"
    }

    ws.onerror { |e|
        puts "Error: #{e.message}"
    }
  end
}

# tmp = RedisMonitor.new

#         tmp.show_tu(10,10)


