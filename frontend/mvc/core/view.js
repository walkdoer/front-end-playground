class View {
  constructor(props) {
    this.props = props;
    this.model = props.model;
    this.$el = document.querySelector(props.el);
    this.render();
    this.model.on('change', this.update.bind(this));
  }

  update() {
    this.render();
  }
}