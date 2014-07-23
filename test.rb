require 'redis'

m = Redis.new(host: "127.0.0.1", port: "6379",db:"1")
m.set('foo', "bar")
puts m.get("foo")