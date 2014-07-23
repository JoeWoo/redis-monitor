require "yaml"
require 'securerandom'

def get_random_data(num)
	f = File.open("./random_key.yml","w+")
	datas = []
	1.upto(num){
		datas << SecureRandom.hex(8)
	}
	f << datas.to_yaml
	f.close
end

get_random_data(10000)