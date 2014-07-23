require 'hiredis'
require 'redis'
require 'yaml'
require 'securerandom'
require 'logger'
require 'json'

class RedisMonitor

	def initialize
		file = File.open(File.dirname(__FILE__)+"/log/test.log", File::WRONLY | File::APPEND)
		@logger = Logger.new(file,'daily')
		@redis_info = YAML.load(File.open("./redis_info.yml"))
		@test_datas = YAML.load(File.open("./random_key.yml"))
		@redises = Array.new()
		@redis_info.each{  |r|
			_redis = Redis.new(:driver => :hiredis, host: r["host"], port: r["port"], db: r["db"])
			@redises << _redis
		}
	end

	def get_random_data(num)
		SecureRandom.hex(num)
	end

	def single_run(redis, ord, expiration, keysnum, ws)
		start_time = Time.now
		@test_datas.each{  |key|
			redis.set(key,'hello world')
			#redis.expire(key,expiration);
		}
		end_time = Time.now

		use_time = end_time - start_time

		host = @redis_info[ord]["host"]

		single_result = { ord: ord, host: host, stime: (start_time.to_f*1000).to_i, etime: (end_time.to_f*1000).to_i, utime: use_time*1000.0}
		#puts "log"
		@logger.info(single_result.to_s)
		#puts single_result.to_s
    		redis.flushdb
		ws.send (single_result.to_json)
	end

	def run_every_n_second(n, keysnum, ws)
		puts "fff"
		while true
	        i = 0
			@redises.each{  |r|
	      		single_result = single_run(r, i, n-5, keysnum, ws)
	      		i+= 1
	      		#@result_queue << single_result
	  		}
	  		sleep(n)
    		end
	end

end