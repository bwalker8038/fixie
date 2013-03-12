window.socket = io.connect();

var Fixie = {};

Fixie.Message = (function($) {
	var methods = {
		init: function() {
			methods.subscribe();
			methods.displayMessage();

			$('.send-message').on('click', function(e) {
				e.preventDefault();
				methods.sendMessage();
			});
		},

		subscribe: function() {
			socket.emit('subscribe', {room: properties.channel()})
		},

		sendMessage: function() {
			var data = {
				body: properties.messageBody(),
				room: properties.channel()
			};

			socket.emit('message', data);
		},

		displayMessage: function() {
			socket.on('message', function(data) {
				$('.message-list').append(view.message(data));
				console.log(data);
			})
		}
	};

	var properties = {
		channel: function() {
			return window.location.pathname;
		},

		messageBody: function() {
			return $('.message-input').val()
		}
	};

	var view = {
		message: function(data) {
			return $('<div class="message">' + data.body + data.author + '</div>');
		}
	}

	return {
		init: methods.init
	}
})(jQuery);

$(document).ready(function() {
	Fixie.Message.init();
});