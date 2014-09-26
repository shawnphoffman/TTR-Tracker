define(['Backbone', 'Marionette', 'models/Player', 'hbs!templates/player-template'],
  function(Backbone, Marionette, Player, template) {

    PlayerView = Backbone.Marionette.ItemView.extend( {
      tagName:  "li",

      className: 'swipeout',

      model: Player,

      events: {
        'click .player-data' : 'toggleActions',
        'click .swipeout-delete' : 'deletePlayer'
      },

      initialize: function() {
        // if (this.model.attributes) {
        //   this.listenTo(this.model, 'update', this.render);
        // }
      },

      toggleActions: function() {
        //console.log('Toggling: ' + this.model.get('name'));

        var self = this;
        var name = self.model.get('name');
        name = name.charAt(0).toUpperCase() + name.substring(1);
        var t = $('.swipeout-opened');
        if (t.length > 0) {
          return false;
        }
        else {
          ttrTracker.actions(
          [
            [
              {text: 'Settings for ' + name, label:true},
              {text:'Edit Name', onClick:function(){
                self.editPlayerName();
              }},
              {text:'Change Color', onClick:function(){
                self.editPlayerColor();
              }}
            ],[
              {text: 'Actions for ' + name, label:true},
              {text:'Add Points', onClick:function(){
                self.displayAddPointsMenu();
              }},
              {text:'Subtract Points', onClick:function(){
                self.displayRemovePointsMenu();
              }},
              {text:'Review Points', onClick:function(){
                self.reviewPointsByName();
              }},
              {text:'* Fast Scoring *', onClick:function(){
                self.quickPoints();
              }, bold:true}
            ],
            [
                { text:'Cancel', color:'red'}
            ]
          ]);
        }
      },

      deletePlayer: function(){
        //console.log('Deleting: ' + this.model.get('name'));

        ttrApp.scoresCollection.removePlayerScores(this.model.get('id'));
        this.model.destroy();
        ttrApp.playersCollection.reSort();
      },

      editPlayerName: function(){
        //console.log('Renaming: ' + this.model.get('name'));

        var oldName = this.model.get('name');
        var self = this;

        ttrTracker.prompt('Please enter a name.', function(data){
          var name = data.replace(/[^\w]/ig, '');
          if (data === undefined || data === '') {
            var num = ttrApp.playersCollection.length;
            var newName = 'Player ' + num;
            var tempPlayerNames = _.filter(ttrApp.playersCollection.models, function(p){
              return p.get('name') == newName;
            });
            if (tempPlayerNames.length > 0) {
              newName += "X";
            }
            name = newName;
          }
          ttrApp.scoresCollection.renameScores(self.model.get('id'), name);
          self.model.set({'name': name}).save();

          ttrApp.playersView.remove();
          ttrApp.playersView.render();
          $('#player-list').html(ttrApp.playersView.el);
          
          ttrTracker.modal({
            title: 'Loading...',
            afterText: '<img src="css/img/loading-spinning-bubbles.svg" alt="Loading icon" />'
          });
          setTimeout(function(){
            ttrTracker.closeModal();
          }, 2000);
        });
      },

      editPlayerColor: function(){
        //console.log('Changing color: ' + this.model.get('name'));

        var self = this;

        ttrTracker.modal({
            title: ttrTracker.params.modalTitle,
            text: 'Please select a color for ' + self.model.get('name'),
            afterText:'<div class="color-buttons">'+
                        '<a href="" class="button color-button" data-color="red">Red</a>'+
                        '<a href="" class="button color-button" data-color="orange">Orange</a>'+
                        '<a href="" class="button color-button" data-color="yellow">Yellow</a>'+
                        '<a href="" class="button color-button" data-color="green">Green</a>'+
                        '<a href="" class="button color-button" data-color="blue">Blue</a>'+
                        '<a href="" class="button color-button" data-color="purple">Purple</a>'+
                        '<a href="" class="button color-button" data-color="pink">Pink</a>'+
                        '<a href="" class="button color-button" data-color="black">Black</a>'+
                        '<a href="" class="button color-button" data-color="white">White</a>'+
                      '</div>',
            buttons: [{
                text:'Cancel',
                color: 'red',
                onClick: function (){},
                close:true,
            }],
            onClick: function(index){
            }
        });

        $('a.color-button').one('click', function(f){
          self.model.set('color', $(this).data('color'));
          self.model.save();
          self.render();
          ttrTracker.closeModal();
        });
      },

      displayAddPointsMenu: function(){
        //console.log('Adding points: ' + this.model.get('name'));

        var self = this;

        var vers = ttrApp.versionsCollection.find(function(model) { return model.get('currentVersion') === true; });
        if (vers !== undefined){

          var ar = [
            {text: 'Add points for ' + _(self.model.get('name')).capitalize(), label:true}
          ];

          _.each(vers.get('routesAvail'), function(route){
            var pts = self.mapTrainPoints(route);

            ar.push({text: route + ' trains (+' + pts.get('score') + ')', onClick:function(){
              self.applyPoints(pts);
            }});

          });
          ar.push({text: 'Add Custom Points', onClick:function(){
            ttrTracker.prompt('Enter custom point value to add', function(value){
              value = value || 0;
              if(!isNaN(value))
              {
                var score = new Score({'score':parseInt(value, 10),
                                       'trains':0,
                                       'date':Date.now(),
                                       'player':self.model.get('name'),
                                       'playerID':self.model.get('id')
                                      });
                self.applyPoints(score);
              }
            }, null, 'number');
          }});

          ttrTracker.actions([ar, [{text: 'Go Back', onClick:function(){ self.toggleActions(); }, color:'red'}]]);
        }
      },

      displayRemovePointsMenu: function(){
        //console.log('Removing points: ' + this.model.get('name'));

        var self = this;

        var vers = ttrApp.versionsCollection.find(function(model) { return model.get('currentVersion') === true; });
        if (vers !== undefined){

          var ar = [
            {text: 'Remove points for ' + _(self.model.get('name')).capitalize(), label:true}
          ];

          _.each(vers.get('routesAvail'), function(route){
            var pts = self.mapTrainPoints(route);

            ar.push({text: '-' + route + ' trains (-' + pts.get('score') + ')', onClick:function(){
              pts.set({'trains':pts.get('trains')*-1, 'score':pts.get('score')*-1});
              self.applyPoints(pts);
            }});

          });
          ar.push({text: 'Remove Custom Points', onClick:function(){
            ttrTracker.prompt('Enter custom point value to remove', function(value){
              value = value || 0;
              if(!isNaN(value))
              {
                var score = new Score({'score':parseInt(value, 10)*-1,
                                       'trains':0,
                                       'date':Date.now(),
                                       'player':self.model.get('name'),
                                       'playerID':self.model.get('id')
                                      });
                self.applyPoints(score);
              }
            }, null, 'number');
          }});

          ttrTracker.actions([ar, [{text: 'Go Back', onClick:function(){ self.toggleActions(); }, color:'red'}]]);
        }
      },

      applyPoints: function(score){
        //console.log('PlayerView - ApplyPoints');

        ttrApp.scoresCollection.create(score);

        this.render();
      },

      mapTrainPoints: function(numTrains){
        switch (numTrains) {
          case 1:
            return new Score({trains:1, score:1, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 2:
            return new Score({trains:2, score:2, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 3:
            return new Score({trains:3, score:4, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 4:
            return new Score({trains:4, score:7, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 5:
            return new Score({trains:5, score:10, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 6:
            return new Score({trains:6, score:15, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 7:
            return new Score({trains:7, score:18, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 8:
            return new Score({trains:8, score:21, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
          case 9:
            return new Score({trains:9, score:27, 'date':Date.now(), 'player':this.model.get('name'), 'playerID':this.model.get('id')});
        }
      },

      reviewPointsByName: function() {
        //console.log('PlayerView - ReviewPointsByName');

        var self = this;
        var temp = '';
        var index = 1;
        _.each(ttrApp.scoresCollection.models, function(score){
          if (score.get('playerID') === self.model.get('id')) {
            var val = score.get('score') > 0 ? '+' + score.get('score') : score.get('score');
            var scoreLabel = Math.abs(score.get('score')) === 1 ? 'point' : 'points';
            var trainLabel = Math.abs(score.get('trains')) === 1 ? 'train' : 'trains';
            temp += '<b>#' + index++ + '</b>: ' + val + ' ' + scoreLabel +' (' + score.get('trains')+ ' ' + trainLabel + ')<br />';
          }
        });
        if (temp === '') { temp = 'No score history available.'; }
        ttrTracker.alert(temp, 'Score History for ' + self.model.get('name'));
      },

      quickPoints: function() {
        //console.log('PlayerView - QuickPoints');

        var self = this;

        if (ttrApp.currentVersion.get('version') === 'Heart of Africa') {
          ttrTracker.alert('Fast Scoring is not available for the Africa expansion. <br /><br />Please score your routes as they are completed.');
        } else {

          ttrTracker.modal({
              title: ttrTracker.params.modalTitle,
              text: 'Please select route values for ' + self.model.get('name') + ': <span id="quick-amt"></span>',
              afterText:'<div class="quick-buttons">'+
                          '<a href="" class="button quick-button" data-train="1" data-score="1" >1 train</a>'+
                          '<a href="" class="button quick-button" data-train="2" data-score="2" >2 trains</a>'+
                          '<a href="" class="button quick-button" data-train="3" data-score="4" >3 trains</a>'+
                          '<a href="" class="button quick-button" data-train="4" data-score="7" >4 trains</a>'+
                          '<a href="" class="button quick-button" data-train="5" data-score="10">5 trains</a>'+
                          '<a href="" class="button quick-button" data-train="6" data-score="15">6 trains</a>'+
                          '<a href="" class="button quick-button" data-train="7" data-score="18">7 trains</a>'+
                          '<a href="" class="button quick-button" data-train="8" data-score="21">8 trains</a>'+
                          '<a href="" class="button quick-button" data-train="9" data-score="27">9 trains</a>'+
                          '<a href="" class="button undo-button">Undo</a>'+
                        '</div>',
              buttons: [{
                  text:'Close',
                  color: 'red',
                  onClick: function (){
                    $('a.quick-button').off('click');
                    $('a.undo-button').off('click');
                  },
                  close:true,
              }],
              onClick: function(index){
              }
          });

          $('a.quick-button').on('click', function(f){
            $('#quick-amt').append('  +'+$(this).data('train'));
            var score = new Score({
              'score':$(this).data('score'),
              'date':Date.now(),
              'player':self.model.get('name'),
              'playerID':self.model.get('id'),
              'trains':$(this).data('train')
            });
            ttrApp.scoresCollection.create(score);
            self.render();
          });

          $('a.undo-button').on('click', function(f){
            if ($('#quick-amt').html().length > 0){
              $('#quick-amt').html(function(i, h){
                return h.substring(0, h.length-4);
              });
              var remove = _.filter(ttrApp.scoresCollection.models, function(score){
                return score.get('playerID') === self.model.get('id');
              });
              var toRemove = remove.pop();
              toRemove.destroy();
              self.render();
            }
          });
        }
      },

      calculateScoreValues: function(){
        var self = this;

        var scores = _.filter(ttrApp.scoresCollection.models, function(score){
          return score.get('playerID') === self.model.get('id');
        });
        var score = _.reduce(scores, function(memo, score){ return memo + score.get('score'); }, 0);
        var trains = _.reduce(scores, function(memo, score){ return memo - score.get('trains'); }, ttrApp.currentVersion.get('numTrains'));

        this.model.set({'trainsLeft':trains, 'score':score}, {silent:true});

        // //console.log('calculateScoreValues - score', score);
        // //console.log('calculateScoreValues - trains', trains);

        this.model.set({'trainsLeft':trains, 'score':score}, {silent:true});
      },

      render: function() {
        //console.log('Rendering Player: ' + this.model.get('name'));

        this.calculateScoreValues();

        var self = this;

        $(this.el).html(template(this.model.toJSON()));
        return this;
      }
    });

    return PlayerView;

  }
);
